import { alphabets, earlyRuns } from "../core/content.js";
import { randomInt, shuffle, node, pick } from "../core/helpers.js";
import { t } from "../core/i18n.js";
import { grid, tile } from "./shared.js";
export const letterOrder = {
  id: "letterOrder",
  create({ locale, level, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const length = level === 3 ? 4 : 3;
    const alphabet = alphabets[locale];
    const start = randomInt(0, alphabet.length - length, rng);
    const sequences =
      level === 1
        ? earlyRuns[locale]
        : Array.from({ length: alphabet.length - length + 1 }, (_, i) =>
            alphabet.slice(i, i + length),
          );
    const runs = sequences.map((letters) => ({
      id: letters.join(""),
      letters,
    }));
    const target = choose("runs", runs).letters;
    const options = shuffle(target, rng);
    return {
      key: target.join(""),
      answer: target,
      options,
      prompt: t(locale, "letterOrder"),
      render(host, api) {
        const line = node("div", "answer-line");
        line.dir = locale === "he" ? "rtl" : "ltr";
        host.append(line);
        const area = grid(host, "letter-grid");
        let index = 0;
        options.forEach((letter) => {
          const element = tile(
            letter,
            () => {
              if (letter !== target[index]) {
                api.wrong(element);
                return;
              }
              line.append(node("span", "placed-letter", letter));
              element.disabled = true;
              element.classList.add("selected");
              index++;
              api.encourage?.();
              if (index === target.length) api.complete();
            },
            "letter-tile",
          );
          area.append(element);
        });
      },
    };
  },
};
