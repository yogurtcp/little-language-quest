import { comparisonSpeech } from "../core/speech.js";
import { randomInt, shuffle, pick } from "../core/helpers.js";
import { t } from "../core/i18n.js";
import { circles } from "../core/art.js";
import { equation, grid, tile } from "./shared.js";
export const compare = {
  id: "compare",
  create({ locale, level, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const max = level === 1 ? 5 : 10;
    const examples = [];
    for (let a = 1; a <= max; a++)
      for (let b = 1; b <= max; b++) examples.push({ id: `${a}:${b}`, a, b });
    const { a, b, id } = choose("comparisons", examples);
    const answer = a < b ? "<" : a > b ? ">" : "=";
    return {
      key: id,
      answer,
      prompt: t(locale, "compare"),
      speech: comparisonSpeech(locale, a, b),
      render(host, api) {
        equation(host, `${a} ? ${b}`);
        if (level === 1) {
          const visual = document.createElement("div");
          visual.className = "math-visual";
          visual.dir = "ltr";
          visual.innerHTML = circles(a) + "<span>?</span>" + circles(b);
          host.append(visual);
        }
        const area = grid(host, "number-choices");
        shuffle(["<", ">", "="], rng).forEach((symbol) => {
          const element = tile(
            symbol,
            () => (symbol === answer ? api.complete() : api.wrong(element)),
            "symbol-tile",
          );
          area.append(element);
        });
      },
    };
  },
};
