import { concepts, word } from "../core/content.js";
import { pick, sample, shuffle } from "../core/helpers.js";
import { t } from "../core/i18n.js";
import { grid, picture, revealWord } from "./shared.js";
export const listenChoose = {
  id: "listenChoose",
  create({ locale, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const answer = choose("words", concepts);
    const options = shuffle(
      [
        answer,
        ...sample(
          concepts.filter((item) => item.id !== answer.id),
          3,
          rng,
        ),
      ],
      rng,
    );
    return {
      key: answer.id,
      answer: answer.id,
      options: options.map((item) => item.id),
      prompt: t(locale, "listenChoose"),
      speech: [t(locale, "listenChoose"), word(answer, locale).speech],
      render(host, api) {
        const area = grid(host, "picture-grid");
        options.forEach((item) => {
          const element = picture(item, locale, () => {
            if (api.isComplete?.()) return;
            if (item.id !== answer.id) return api.wrong(element);
            revealWord(element, item, api);
            api.complete();
          });
          area.append(element);
        });
      },
    };
  },
};
