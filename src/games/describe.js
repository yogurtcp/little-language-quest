import { concepts } from '../core/content.js';
import { pick, sample, shuffle } from '../core/helpers.js';
import { copy } from '../core/i18n.js';
import { grid, picture } from './shared.js';
const facts = ['woof','meow','moo','quack','red','sweet'];
export const describe = {
  id: 'describe',
  create({ locale, rng }) {
    const fact = pick(facts,rng);
    const answer = pick(concepts.filter(item=>item.facts.includes(fact)),rng);
    const others = sample(concepts.filter(item=>!item.facts.includes(fact)),3,rng);
    const options = shuffle([answer,...others],rng);
    return {
      prompt: copy[locale].facts[fact],
      render(host, api) {
        const area = grid(host,'picture-grid');
        options.forEach(item => {
          const element = picture(item,locale,()=> item.id===answer.id ? api.complete() : api.wrong(element));
          area.append(element);
        });
      }
    };
  }
};
