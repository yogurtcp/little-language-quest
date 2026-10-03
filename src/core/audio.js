import { languages } from "./i18n.js";
import { audioManifest } from "./audio-manifest.js";
import { readSetting, writeSetting } from "./storage.js";
export class GameAudio {
  constructor() {
    this.muted = readSetting("llq-muted") === "1";
    this.context = null;
    this.voices = [];
    this.generation = 0;
    this.source = null;
    this.buffers = new Map();
    this.onStatus = () => {};
    this.status = "idle";
    this.refreshVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", () =>
      this.refreshVoices(),
    );
  }
  refreshVoices() {
    this.voices = window.speechSynthesis?.getVoices() || [];
  }
  voice(locale) {
    return (
      this.voices.find((voice) =>
        voice.lang.toLowerCase().startsWith(locale),
      ) || null
    );
  }
  async unlock() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!this.context && AudioContext) this.context = new AudioContext();
    if (this.context && this.context.state !== "running")
      await this.context.resume();
    this.refreshVoices();
  }
  notify(status) {
    this.status = status;
    this.onStatus(status);
  }
  stop() {
    this.generation++;
    this.source?.stop();
    this.source = null;
    window.speechSynthesis?.cancel();
    this.notify(this.muted ? "muted" : "idle");
  }
  setMuted(value) {
    this.muted = value;
    writeSetting("llq-muted", value ? "1" : "0");
    this.stop();
  }
  async buffer(path) {
    if (this.buffers.has(path)) return this.buffers.get(path);
    const response = await fetch(new URL(`../../${path}`, import.meta.url));
    if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
    const decoded = await this.context.decodeAudioData(
      await response.arrayBuffer(),
    );
    // Bound decoded PCM memory; compressed files are retained by the service worker.
    if (this.buffers.size >= 24)
      this.buffers.delete(this.buffers.keys().next().value);
    this.buffers.set(path, decoded);
    return decoded;
  }
  async speak(input, locale) {
    this.stop();
    if (this.muted) return false;
    const generation = this.generation;
    const parts = Array.isArray(input) ? input : [input];
    this.notify("loading");
    try {
      await this.unlock();
      if (!this.context || this.context.state !== "running")
        throw new Error("Audio requires a tap");
      // Download together; play sequentially without words interrupting one another.
      const buffers = await Promise.all(
        parts.map((text) => {
          const path = audioManifest[locale]?.[text];
          if (!path) throw new Error(`Missing recording: ${locale}/${text}`);
          return this.buffer(path);
        }),
      );
      for (const buffer of buffers) {
        if (generation !== this.generation) return false;
        this.notify("speaking");
        await new Promise((resolve) => {
          const source = this.context.createBufferSource();
          this.source = source;
          source.buffer = buffer;
          source.connect(this.context.destination);
          source.onended = () => {
            if (this.source === source) this.source = null;
            resolve();
          };
          source.start();
        });
      }
      if (generation === this.generation) this.notify("idle");
      return true;
    } catch {
      if (generation !== this.generation) return false;
      // Offline first-time clip or blocked playback: same-language system voice only.
      this.refreshVoices();
      const voice = this.voice(locale);
      if (voice && window.SpeechSynthesisUtterance) {
        const utterance = new window.SpeechSynthesisUtterance(parts.join(". "));
        utterance.voice = voice;
        utterance.lang = languages.find((lang) => lang.code === locale).tag;
        utterance.rate = 0.85;
        utterance.onend = () => {
          if (generation === this.generation) this.notify("idle");
        };
        utterance.onerror = () => {
          if (generation === this.generation) this.notify("error");
        };
        this.notify("speaking");
        window.speechSynthesis.speak(utterance);
        return true;
      }
      this.notify("error");
      return false;
    }
  }
  tone(frequency, when, duration, gain = 0.08) {
    if (!this.context || this.muted || this.context.state !== "running") return;
    const oscillator = this.context.createOscillator(),
      volume = this.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, when);
    volume.gain.setValueAtTime(0.001, when);
    volume.gain.exponentialRampToValueAtTime(gain, when + 0.02);
    volume.gain.exponentialRampToValueAtTime(0.001, when + duration);
    oscillator.connect(volume).connect(this.context.destination);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.02);
  }
  effect(kind) {
    if (!this.context || this.muted) return;
    const now = this.context.currentTime;
    if (kind === "right")
      [523, 659, 784].forEach((note, i) =>
        this.tone(note, now + i * 0.12, i === 2 ? 0.24 : 0.13),
      );
    else if (kind === "star")
      [523, 659, 784, 1047].forEach((note, i) =>
        this.tone(note, now + i * 0.12, 0.25),
      );
    else {
      this.tone(320, now, 0.14, 0.035);
      this.tone(270, now + 0.1, 0.14, 0.025);
    }
  }
}
