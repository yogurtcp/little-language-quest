import { pick, shuffle, randomInt } from '../core/helpers.js';
import { t } from '../core/i18n.js';
import { grid, group } from './shared.js';
export const countGroup = {
  id: 'countGroup',
  create({ locale, level, rng }) {
    const max = level === 1 ? 5 : 10;
    const target = randomInt(1,max,rng);
    const distractors = shuffle(Array.from({length:max},(_,i)=>i+1).filter(n=>n!==target),rng).slice(0,2);
    const options = shuffle([target,...distractors],rng);
    return {
      prompt: t(locale,'countGroup',target),
      render(host, api) {
        const area = grid(host,'count-grid');
        options.forEach(n => {
          const element = group(n, () => n === target ? api.complete() : api.wrong(element));
          area.append(element);
        });
      }
    };
  }
};
