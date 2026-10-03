import { concepts, earlyLetters, word } from '../core/content.js';
import { pick, sample, shuffle } from '../core/helpers.js';
import { art } from '../core/art.js';
import { t } from '../core/i18n.js';
import { grid, tile } from './shared.js';
export const firstLetter = {
  id: 'firstLetter',
  create({ locale, level, rng }) {
    const pool = level === 1 ? concepts.filter(item=>earlyLetters[locale].includes(word(item,locale).initial)) : concepts;
    const item = pick(pool,rng);
    const answer = word(item,locale).initial;
    const letters = [...new Set(concepts.map(entry=>word(entry,locale).initial))].filter(letter=>letter!==answer);
    const options = shuffle([answer,...sample(letters,3,rng)],rng);
    return {
      prompt: t(locale,'firstLetter',word(item,locale).display),
      speech: t(locale,'firstLetter',word(item,locale).speech),
      render(host, api) {
        const visual = document.createElement('div'); visual.className = 'hero-art'; visual.innerHTML = art(item.art,word(item,locale).display); host.append(visual);
        const area = grid(host,'letter-grid');
        options.forEach(letter => {
          const element = tile(letter, () => letter === answer ? api.complete() : api.wrong(element),'letter-tile');
          area.append(element);
        });
      }
    };
  }
};
