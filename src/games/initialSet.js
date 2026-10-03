import { initialSpeech } from "../core/speech.js";
import { concepts, groups, word } from "../core/content.js";
import { pick, sample, shuffle } from "../core/helpers.js";
import { t } from "../core/i18n.js";
import { grid, picture, revealWord } from "./shared.js";
export const initialSet = {
  id: "initialSet",
  create({ locale, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const [letter, matches] = choose("letters", groups(locale));
    const correct = [];
    while (correct.length < 3)
      correct.push(
        choose(
          `words:${letter}`,
          matches.filter((item) => !correct.includes(item)),
        ),
      );
    const others = sample(
      concepts.filter((item) => word(item, locale).initial !== letter),
      3,
      rng,
    );
    const options = shuffle([...correct, ...others], rng);
    return {
      key: letter,
      answers: correct.map((item) => item.id),
      options: options.map((item) => item.id),
      prompt: t(locale, "initialSet", letter),
      speech: initialSpeech(locale, letter),
      render(host, api) {
        const area = grid(host, "picture-grid");
        const found = new Set();
        options.forEach((item) => {
          const element = picture(item, locale, () => {
            if (api.isComplete?.() || found.has(item.id)) return;
            if (!correct.includes(item)) {
              api.wrong(element);
              return;
            }
            found.add(item.id);
            revealWord(element, item, api);
            if (found.size === correct.length) api.complete();
          });
          area.append(element);
        });
      },
    };
  },
};
