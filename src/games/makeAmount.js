import { quantitySpeech } from "../core/speech.js";
import { randomInt, node, button, pick } from "../core/helpers.js";
import { t } from "../core/i18n.js";
export const makeAmount = {
  id: "makeAmount",
  create({ locale, level, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const max = level === 1 ? 5 : 10;
    const target = choose(
      "targets",
      Array.from({ length: max - 1 }, (_, i) => i + 2),
    );
    const start = pick(
      Array.from({ length: max + 1 }, (_, i) => i).filter((n) => n !== target),
      rng,
    );
    return {
      key: `${target}:${start}`,
      answer: target,
      start,
      prompt: t(locale, "makeAmount", target),
      speech: quantitySpeech(locale, "makeAmount", target),
      render(host, api) {
        let count = start;
        const row = node("div", "make-row");
        const minus = button("round-control", "−", () => change(-1));
        const stars = node("div", "make-stars");
        const plus = button("round-control", "+", () => change(1));
        row.append(minus, stars, plus);
        host.append(row);
        const number = node("div", "make-number");
        host.append(number);
        function draw() {
          stars.textContent = "★".repeat(count);
          number.textContent = `${count} / ${target}`;
          minus.disabled = count === 0;
          plus.disabled = count === max;
        }
        function change(delta) {
          if (api.isComplete?.()) return;
          const distance = Math.abs(count - target);
          count = Math.max(0, Math.min(max, count + delta));
          draw();
          if (count === target) api.complete();
          else if (Math.abs(count - target) > distance)
            api.wrong(delta > 0 ? plus : minus);
        }
        draw();
      },
    };
  },
};
