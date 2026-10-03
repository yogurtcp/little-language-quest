import { concepts, groups, word } from '../core/content.js';
import { pick, sample, shuffle } from '../core/helpers.js';
import { t } from '../core/i18n.js';
import { grid, picture } from './shared.js';
export const initialSet = {
  id: 'initialSet',
  create({ locale, rng }) {
    const [letter, matches] = pick(groups(locale), rng);
    const correct = sample(matches, 3, rng);
    const others = sample(concepts.filter(item => word(item,locale).initial !== letter), 3, rng);
    const options = shuffle([...correct, ...others], rng);
    return {
      prompt: t(locale,'initialSet',letter),
      render(host, api) {
        const area = grid(host, 'picture-grid');
        const found = new Set();
        options.forEach(item => {
          const element = picture(item, locale, () => {
            if (found.has(item.id)) return;
            if (!correct.includes(item)) { api.wrong(element); return; }
            found.add(item.id);
            element.classList.add('selected');
            api.audio.speak(word(item,locale).speech, locale);
            if (found.size === correct.length) api.complete();
          });
          area.append(element);
        });
      }
    };
  }
};
