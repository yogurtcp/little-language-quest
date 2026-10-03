import { shuffle, node, button, pick } from "../core/helpers.js";
import { t, copy } from "../core/i18n.js";
import { grid } from "./shared.js";
const symbols = ["circle", "square", "triangle", "diamond"].flatMap((shape) =>
  ["coral", "teal", "gold", "purple"].map((color) => ({
    id: `${shape}:${color}`,
    shape,
    color,
  })),
);
function visual(symbol) {
  const element = node(
    "span",
    `pattern-symbol ${symbol.shape} ${symbol.color}`,
  );
  element.setAttribute("aria-hidden", "true");
  return element;
}
export const patternNext = {
  id: "patternNext",
  create({ locale, level, rng }) {
    const [a, b, c] = shuffle(symbols, rng).slice(0, 3);
    const unit =
      level === 1
        ? [a, b]
        : level === 2
          ? pick(
              [
                [a, a, b],
                [a, b, b],
              ],
              rng,
            )
          : pick(
              [
                [a, b, c],
                [a, a, b],
                [a, b, b],
              ],
              rng,
            );
    const pattern = [...unit, ...unit];
    const answer = unit[0];
    const options = shuffle(
      [
        answer,
        ...shuffle(
          symbols.filter((item) => item !== answer),
          rng,
        ).slice(0, 2),
      ],
      rng,
    );
    return {
      key: unit.map((item) => item.id).join(","),
      answer: answer.id,
      options: options.map((item) => item.id),
      prompt: t(locale, "patternNext"),
      render(host, api) {
        const line = node("div", "pattern-line");
        pattern.forEach((item) => line.append(visual(item)));
        line.append(node("span", "pattern-question", "?"));
        host.append(line);
        const area = grid(host, "pattern-choices");
        options.forEach((item) => {
          const element = button("choice pattern-choice", visual(item), () =>
            item === answer ? api.complete() : api.wrong(element),
          );
          const names = copy[locale].patternNames;
          element.setAttribute(
            "aria-label",
            `${names[item.color]} ${names[item.shape]}`,
          );
          area.append(element);
        });
      },
    };
  },
};
