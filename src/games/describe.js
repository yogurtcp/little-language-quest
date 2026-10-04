import { byId } from "../core/content.js";
import { pick, sample, shuffle } from "../core/helpers.js";
import { clues } from "../core/clues.js";
import { grid, picture, revealWord, wrongPicture } from "./shared.js";
export const describe = {
  id: "describe",
  create({ locale, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const clue = choose("clues", clues);
    const answer = byId[choose(`answers:${clue.id}`, clue.answers)];
    const options = shuffle(
      [
        answer,
        ...sample(
          clue.distractors.map((id) => byId[id]),
          3,
          rng,
        ),
      ],
      rng,
    );
    return {
      key: clue.id,
      answer: answer.id,
      options: options.map((item) => item.id),
      prompt: clue.prompts[locale],
      render(host, api) {
        const area = grid(host, "picture-grid");
        for (const item of options) {
          const element = picture(item, locale, () => {
            if (api.isComplete?.()) return;
            if (item.id !== answer.id) return wrongPicture(element, item, api);
            revealWord(element, item, api);
            api.complete();
          });
          area.append(element);
        }
      },
    };
  },
};
