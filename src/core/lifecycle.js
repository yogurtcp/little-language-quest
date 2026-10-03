export class TaskLifetime {
  constructor() {
    this.alive = true;
    this.timers = new Set();
  }
  later(callback, delay) {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (this.alive) callback();
    }, delay);
    this.timers.add(timer);
    return timer;
  }
  dispose() {
    this.alive = false;
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
  }
}
