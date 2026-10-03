import test from "node:test";
import assert from "node:assert/strict";
import { GameAudio } from "../src/core/audio.js";
import { audioManifest } from "../src/core/audio-manifest.js";
test("recorded speech works with zero installed voices and plays all segments", async () => {
  let played = 0;
  class Context {
    constructor() {
      this.state = "running";
    }
    async decodeAudioData() {
      return {};
    }
    createBufferSource() {
      return {
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
    }
    async decodeAudioData() {
      return {};
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
