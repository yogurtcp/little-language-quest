import { mathSpeech } from "../core/speech.js";
import { randomInt, shuffle, pick } from "../core/helpers.js";
import { t } from "../core/i18n.js";
import { circles } from "../core/art.js";
import { equation, numberChoices } from "./shared.js";
export const arithmetic = {
  id: "arithmetic",
  create({ locale, level, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const max = level === 1 ? 5 : 10;
    const examples = [];
    for (let a = 1; a <= max; a++)
      for (let b = 1; b <= max; b++) {
        if (a + b <= max)
          examples.push({ id: `${a}+${b}`, a, b, plus: true, answer: a + b });
        if (a >= b)
          examples.push({ id: `${a}-${b}`, a, b, plus: false, answer: a - b });
      }
    const { id, a, b, plus, answer } = choose("examples", examples);
    const options = shuffle(
      [
        answer,
        ...shuffle(
          Array.from({ length: max + 1 }, (_, i) => i).filter(
            (n) => n !== answer,
          ),
          rng,
        ).slice(0, 2),
      ],
      rng,
    );
    return {
      key: id,
      answer,
      options,
      prompt: t(locale, "arithmetic"),
      speech: mathSpeech(locale, a, b, plus),
      render(host, api) {
        equation(host, `${a} ${plus ? "+" : "−"} ${b} = ?`);
        if (level === 1) {
          const visual = document.createElement("div");
          visual.className = "math-visual";
          visual.dir = "ltr";
          visual.innerHTML =
            circles(a) + `<span>${plus ? "+" : "−"}</span>` + circles(b);
          host.append(visual);
        }
        numberChoices(host, options, answer, api);
      },
    };
  },
};
