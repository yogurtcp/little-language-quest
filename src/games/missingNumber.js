import { randomInt, shuffle, pick } from "../core/helpers.js";
import { t } from "../core/i18n.js";
import { equation, numberChoices } from "./shared.js";
export const missingNumber = {
  id: "missingNumber",
  create({ locale, level, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const max = level === 1 ? 5 : 10;
    const examples = [];
    for (let start = 0; start <= max - 3; start++)
      for (const descending of level > 1 ? [false, true] : [false])
        for (const gap of [1, 2]) {
          const sequence = Array.from(
            { length: 4 },
            (_, i) => start + (descending ? 3 - i : i),
          );
          examples.push({ id: `${start}:${descending}:${gap}`, sequence, gap });
        }
    const { id, sequence, gap } = choose("sequences", examples),
      answer = sequence[gap];
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
      prompt: t(locale, "missingNumber"),
      render(host, api) {
        equation(
          host,
          sequence.map((n, i) => (i === gap ? "?" : n)).join("  ·  "),
        );
        numberChoices(host, options, answer, api);
      },
    };
  },
};
