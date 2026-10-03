import { pick, seeded, shuffle } from "./helpers.js";
import { readSetting, writeSetting } from "./storage.js";
const identity = (value) =>
  String(value?.id ?? (Array.isArray(value) ? value[0] : value));
export function context(
  locale,
  level,
  rng,
  choose = (_key, pool) => pick(pool, rng),
) {
  return { locale, level, rng, choose };
}
// Each activity is played once per round. Content decks persist separately per language.
export class TaskScheduler {
  constructor() {
    try {
      this.history = JSON.parse(readSetting("llq-decks-v2", "{}")) || {};
    } catch {
      this.history = {};
    }
    if (typeof this.history !== "object" || Array.isArray(this.history))
      this.history = {};
    this.bags = {};
    this.last = {};
  }
  choose(locale, key, pool, rng) {
    if (!pool.length) throw new Error(`Empty content deck: ${key}`);
    const id = `${locale}:${key}`;
    const seen = Array.isArray(this.history[id]) ? this.history[id] : [];
    let remaining = pool.filter((value) => !seen.includes(identity(value)));
    if (!remaining.length)
      remaining = pool.filter((value) => identity(value) !== seen.at(-1));
    if (!remaining.length) remaining = pool;
    const selected = pick(remaining, rng);
    const valid = new Set(pool.map(identity));
    const exhausted = pool.every((value) => seen.includes(identity(value)));
    // Preserve excluded items when a board draws several distinct cards from one deck.
    const retained = exhausted
      ? seen.filter((value) => !valid.has(value))
      : seen;
    this.history[id] = [
      ...retained.filter((value) => value !== identity(selected)),
      identity(selected),
    ].slice(-512);
    return selected;
  }
  next(games, locale, levelFor) {
    const rng = Math.random;
    if (!this.bags[locale]?.length) {
      const bag = shuffle(
        games.map((game) => game.id),
        rng,
      );
      if (bag.at(-1) === this.last[locale] && bag.length > 1)
        [bag[0], bag[bag.length - 1]] = [bag.at(-1), bag[0]];
      this.bags[locale] = bag;
    }
    const gameId = this.bags[locale].pop();
    const game = games.find((game) => game.id === gameId);
    this.last[locale] = game.id;
    const level = typeof levelFor === "function" ? levelFor(game.id) : levelFor;
    const choose = (key, pool) =>
      this.choose(locale, `${game.id}:${key}`, pool, rng);
    const task = game.create(context(locale, level, rng, choose));
    writeSetting("llq-decks-v2", JSON.stringify(this.history));
    return { game, task, level };
  }
}
// Lab seeds reproduce the same question without modifying the child's decks.
export function nextTask(
  games,
  locale,
  level,
  _recent = [],
  seed = Math.floor(Math.random() * 2 ** 32),
) {
  const rng = seeded(seed),
    game = pick(games, rng);
  return { game, task: game.create(context(locale, level, rng)), seed, level };
}
