import test from "node:test";
import assert from "node:assert/strict";
import { speechBounds, speechSchedule } from "../src/core/audio-timing.js";
import { GameAudio } from "../src/core/audio.js";
import { audioManifest } from "../src/core/audio-manifest.js";
function recording() {
  const samples = new Float32Array(24000 * 3);
  for (let i = 6000; i < 24000; i++) samples[i] = 0.2 * Math.sin(i);
  return { sampleRate: 24000, duration: 3, getChannelData: () => samples };
}
test("recorded speech works with zero installed voices and plays all segments", async () => {
  let played = 0;
  class Context {
    constructor() {
      this.state = "running";
      this.currentTime = 0;
    }
    async decodeAudioData() {
      return recording();
    }
    createBufferSource() {
      return {
        playbackRate: { value: 1 },
        connect() {},
        start() {
          played++;
          queueMicrotask(() => this.onended());
        },
        stop() {
          this.onended?.();
        },
      };
    }
  }
  globalThis.window = { AudioContext: Context };
  globalThis.fetch = async () => ({
    ok: true,
    arrayBuffer: async () => new ArrayBuffer(2),
  });
  const audio = new GameAudio(),
    statuses = [];
  audio.onStatus = (status) => statuses.push(status);
  const texts = Object.keys(audioManifest.ru).slice(0, 3);
  assert.equal(await audio.speak(texts, "ru"), true);
  assert.equal(played, 3);
  assert.ok(statuses.includes("speaking"));
  assert.equal(audio.status, "idle");
});
test("cancelled downloads cannot speak over a new screen; errors are visible", async () => {
  let finish,
    played = 0;
  class Context {
    constructor() {
      this.state = "running";
      this.currentTime = 0;
    }
    async decodeAudioData() {
      return recording();
    }
    createBufferSource() {
      played++;
    }
  }
  globalThis.window = { AudioContext: Context };
  globalThis.fetch = () =>
    new Promise((resolve) => {
      finish = () =>
        resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(2) });
    });
  const audio = new GameAudio();
  const pending = audio.speak(Object.keys(audioManifest.ru)[0], "ru");
  await Promise.resolve();
  audio.stop();
  finish();
  await pending;
  assert.equal(played, 0);
  globalThis.fetch = async () => {
    throw new Error("offline");
  };
  const fresh = new GameAudio();
  assert.equal(
    await fresh.speak(Object.keys(audioManifest.he)[0], "he"),
    false,
  );
  assert.equal(fresh.status, "error");
});

test("composed comparisons trim long silence and leave only a short inter-clip gap", () => {
  const clip = recording(),
    span = speechBounds(clip);
  assert.ok(span.offset >= 0.17 && span.offset <= 0.19);
  assert.ok(span.duration < 1);
  const schedule = speechSchedule([clip, clip, clip, clip], 5);
  for (let i = 1; i < schedule.length; i++) {
    const previous = schedule[i - 1];
    const gap =
      schedule[i].at - (previous.at + previous.duration / previous.rate);
    assert.ok(Math.abs(gap - 0.035) < 0.0001);
  }
  assert.ok(schedule.at(-1).at + schedule.at(-1).duration / 1.08 - 5 < 4);
});
test("a stale failed audio response is retried without using the cache", async () => {
  const attempts = [];
  class Context {
    constructor() {
      this.state = "running";
      this.currentTime = 0;
    }
    async decodeAudioData() {
      return recording();
    }
    createBufferSource() {
      return {
        playbackRate: { value: 1 },
        connect() {},
        start() {
          queueMicrotask(() => this.onended());
        },
        stop() {
          this.onended?.();
        },
      };
    }
  }
  globalThis.window = { AudioContext: Context };
  globalThis.fetch = async (_url, options) => {
    attempts.push(options.cache);
    return {
      ok: attempts.length > 1,
      status: 404,
      arrayBuffer: async () => new ArrayBuffer(2),
    };
  };
  const audio = new GameAudio();
  assert.equal(await audio.speak("Где два кружка?", "ru"), true);
  assert.deepEqual(attempts, ["default", "reload"]);
});

test("Hebrew does not fall back to a system voice that can ignore niqqud", async () => {
  let spoken = 0;
  globalThis.window = {
    speechSynthesis: {
      getVoices: () => [{ lang: "he-IL" }],
      addEventListener() {},
      cancel() {},
      speak() {
        spoken++;
      },
    },
    SpeechSynthesisUtterance: class {},
  };
  const audio = new GameAudio();
  audio.setHebrewVoice("recorded");
  assert.equal(
    await audio.speak(Object.keys(audioManifest.he)[0], "he"),
    false,
  );
  assert.equal(spoken, 0);
  assert.equal(audio.status, "error");
});

test("Hebrew device voice is optional and reads the selected pointed prompt", async () => {
  const spoken = [],
    voice = { lang: "he-IL", name: "Hebrew" };
  globalThis.window = {
    speechSynthesis: {
      getVoices: () => [voice],
      addEventListener() {},
      cancel() {},
      speak(utterance) {
        spoken.push(utterance);
      },
    },
    SpeechSynthesisUtterance: class {
      constructor(text) {
        this.text = text;
      }
    },
  };
  const audio = new GameAudio();
  audio.setHebrewVoice("device");
  assert.equal(audio.hasHebrewDeviceVoice(), true);
  assert.equal(await audio.speak("אֵיפֹה יֵשׁ שְׁנֵי עִגּוּלִים?", "he"), true);
  assert.equal(spoken.length, 1);
  assert.equal(spoken[0].voice, voice);
  assert.equal(spoken[0].lang, "he-IL");
  assert.equal(spoken[0].text, "אֵיפֹה יֵשׁ שְׁנֵי עִגּוּלִים?");
  audio.setHebrewVoice("recorded");
  assert.equal(await audio.speak("אֵיפֹה יֵשׁ שְׁנֵי עִגּוּלִים?", "he"), false);
  assert.equal(spoken.length, 1);
});

test("saved volume boosts recorded speech and effects through a peak limiter", async () => {
  const saved = new Map(),
    originalStorage = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  };
  const connected = [];
  class Context {
    constructor() {
      this.state = "running";
      this.currentTime = 0;
      this.destination = { name: "speaker" };
    }
    createGain() {
      const gain = {
        value: 1,
        setTargetAtTime(value) {
          this.value = value;
        },
        setValueAtTime() {},
        exponentialRampToValueAtTime() {},
      };
      return {
        gain,
        connect(target) {
          connected.push([this, target]);
          return target;
        },
      };
    }
    createDynamicsCompressor() {
      return {
        threshold: { value: 0 },
        knee: { value: 0 },
        ratio: { value: 0 },
        attack: { value: 0 },
        release: { value: 0 },
        connect: () => this.destination,
      };
    }
    async decodeAudioData() {
      return recording();
    }
    createBufferSource() {
      return {
        playbackRate: { value: 1 },
        connect(target) {
          connected.push(["speech", target]);
        },
        start() {
          queueMicrotask(() => this.onended());
        },
        stop() {
          this.onended?.();
        },
      };
    }
    createOscillator() {
      return {
        type: "",
        frequency: { setValueAtTime() {} },
        connect(target) {
          connected.push(["effect", target]);
          return target;
        },
        start() {},
        stop() {},
      };
    }
  }
  try {
    globalThis.window = { AudioContext: Context };
    globalThis.fetch = async () => ({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(2),
    });
    const audio = new GameAudio();
    audio.setVolume(250);
    assert.equal(saved.get("llq-volume"), "250");
    assert.equal(
      await audio.speak(Object.keys(audioManifest.ru)[0], "ru"),
      true,
    );
    assert.equal(audio.master.gain.value, 2.5);
    assert.equal(
      connected.some(
        ([kind, target]) => kind === "speech" && target === audio.master,
      ),
      true,
    );
    audio.effect("right");
    assert.equal(
      connected.some(
        ([kind, target]) => kind !== "speech" && target === audio.master,
      ),
      true,
    );
    audio.setVolume(0);
    assert.equal(audio.muted, true);
    assert.equal(
      await audio.speak(Object.keys(audioManifest.ru)[0], "ru"),
      false,
    );
    audio.setVolume(150);
    assert.equal(audio.muted, false);
    assert.equal(audio.master.gain.value, 1.5);
    assert.equal(new GameAudio().volume, 150);
  } finally {
    globalThis.localStorage = originalStorage;
  }
});


test("the new Hebrew release defaults to approved recordings even after an old device preference", () => {
  const originalStorage = globalThis.localStorage;
  globalThis.localStorage = {getItem(key) { return key === "llq-hebrew-voice" ? "device" : null; }};
  globalThis.window = {};
  try {
    assert.equal(new GameAudio().hebrewVoice, "recorded");
  } finally {
    globalThis.localStorage = originalStorage;
  }
});
