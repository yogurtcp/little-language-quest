import { languages } from './i18n.js';
export class GameAudio {
  constructor() {
    this.muted = localStorage.getItem('llq-muted') === '1';
    this.context = null;
    this.voices = [];
    this.pending = null;
    this.refreshVoices();
    if ('speechSynthesis' in window) speechSynthesis.addEventListener('voiceschanged', () => {
      this.refreshVoices();
      if (this.pending && this.voice(this.pending.locale)) {
        const pending = this.pending;
        this.pending = null;
        this.speak(pending.text, pending.locale);
      }
    });
  }
  refreshVoices() { this.voices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : []; }
  voice(locale) {
    const prefix = locale === 'he' ? 'he' : locale === 'ru' ? 'ru' : 'en';
    return this.voices.find(v => v.lang.toLowerCase().startsWith(prefix)) || null;
  }
  async unlock() {
    if (!this.context) this.context = new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === 'suspended') await this.context.resume();
    this.refreshVoices();
  }
  setMuted(value) {
    this.muted = value;
    localStorage.setItem('llq-muted', value ? '1' : '0');
    if (value) this.pending = null;
    if (value && 'speechSynthesis' in window) speechSynthesis.cancel();
  }
  speak(text, locale) {
    if (this.muted || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languages.find(lang => lang.code === locale).tag;
    utterance.rate = 0.83;
    utterance.pitch = 1.05;
    const voice = this.voice(locale);
    if (!voice) { this.pending = { text, locale }; return false; }
    this.pending = null;
    utterance.voice = voice;
    speechSynthesis.speak(utterance);
    return true;
  }
  tone(frequency, when, duration, gain = 0.08) {
    if (!this.context || this.muted) return;
    const oscillator = this.context.createOscillator();
    const volume = this.context.createGain();
    oscillator.type = 'sine';
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
    if (kind === 'right') { this.tone(523,now,0.13); this.tone(659,now+0.12,0.13); this.tone(784,now+0.24,0.24); }
    else if (kind === 'star') { [523,659,784,1047].forEach((note,i) => this.tone(note,now+i*0.12,0.25)); }
    else { this.tone(320,now,0.14,0.035); this.tone(270,now+0.1,0.14,0.025); }
  }
}
