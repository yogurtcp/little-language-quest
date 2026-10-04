import { firstSpeech } from "../core/speech.js";
import { concepts, earlyLetters, word } from "../core/content.js";
import { pick, sample, shuffle } from "../core/helpers.js";
import { art } from "../core/art.js";
import { t } from "../core/i18n.js";
import { grid, tile, revealWord } from "./shared.js";
export const firstLetter = {
  id: "firstLetter",
  create({ locale, level, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const pool =
      level === 1
        ? concepts.filter((item) =>
            earlyLetters[locale].includes(word(item, locale).initial),
          )
        : concepts;
    const item = choose("words", pool);
    const answer = word(item, locale).initial;
    const letters = [
      ...new Set(concepts.map((entry) => word(entry, locale).initial)),
    ].filter((letter) => letter !== answer);
    const options = shuffle([answer, ...sample(letters, 3, rng)], rng);
    return {
      key: item.id,
      answer,
      options,
      prompt: t(locale, "firstLetterPicture"),
      speech: firstSpeech(locale, item),
      render(host, api) {
        const visual = document.createElement("div");
        visual.className = "hero-art";
        visual.innerHTML = art(item.art, word(item, locale).display);
        host.append(visual);
        const area = grid(host, "letter-grid");
        options.forEach((letter) => {
          const element = tile(
            letter,
            () => {
              if (api.isComplete?.()) return;
              if (letter !== answer) return api.wrong(element);
              element.classList.add("selected");
              revealWord(visual, item, api);
              api.complete();
            },
            "letter-tile",
          );
          area.append(element);
        });
      },
    };
  },
};
