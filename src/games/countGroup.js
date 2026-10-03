import { quantitySpeech } from "../core/speech.js";
import { pick, shuffle, randomInt } from "../core/helpers.js";
import { t } from "../core/i18n.js";
import { grid, group } from "./shared.js";
export const countGroup = {
  id: "countGroup",
  create({ locale, level, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const max = level === 1 ? 5 : 10;
    const target = choose(
      "counts",
      Array.from({ length: max }, (_, i) => i + 1),
    );
    const distractors = shuffle(
      Array.from({ length: max }, (_, i) => i + 1).filter((n) => n !== target),
      rng,
    ).slice(0, 2);
    const options = shuffle([target, ...distractors], rng);
    return {
      key: String(target),
      answer: target,
      options,
      prompt: t(locale, "countGroup", target),
      speech: quantitySpeech(locale, "countGroup", target),
      render(host, api) {
        const area = grid(host, "count-grid");
        options.forEach((n) => {
          const element = group(n, () =>
            n === target ? api.complete() : api.wrong(element),
          );
          area.append(element);
        });
      },
    };
  },
};
