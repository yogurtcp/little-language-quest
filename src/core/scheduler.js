import { pick, seeded } from './helpers.js';
export function nextTask(games, locale, level, recentTypes = [], seed = Math.floor(Math.random() * 2 ** 32)) {
  const rng = seeded(seed);
  const available = games.filter(game => !game.canGenerate || game.canGenerate(locale, level));
  const options = available.filter(game => !recentTypes.slice(-1).includes(game.id));
  const game = pick(options.length ? options : available, rng);
  return { game, task: game.create({ locale, level, rng }), seed };
}
