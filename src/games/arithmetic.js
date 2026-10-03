import { randomInt, shuffle } from '../core/helpers.js';
import { t } from '../core/i18n.js';
import { circles } from '../core/art.js';
import { equation, numberChoices } from './shared.js';
export const arithmetic = {
  id: 'arithmetic',
  create({ locale, level, rng }) {
    const max = level === 1 ? 5 : 10;
    const plus = rng() < 0.6;
    let a,b,answer;
    if (plus) { a=randomInt(0,max-1,rng); b=randomInt(1,max-a,rng); answer=a+b; }
    else { a=randomInt(1,max,rng); b=randomInt(0,a,rng); answer=a-b; }
    const options = shuffle([answer,...shuffle(Array.from({length:max+1},(_,i)=>i).filter(n=>n!==answer),rng).slice(0,2)],rng);
    return {
      prompt: t(locale,'arithmetic'),
      speech: t(locale,'arithmeticSpeech',a,b,plus),
      render(host, api) {
        equation(host, `${a} ${plus?'+':'−'} ${b} = ?`);
        if (level === 1) {
          const visual = document.createElement('div'); visual.className='math-visual'; visual.dir='ltr';
          visual.innerHTML = circles(a) + `<span>${plus?'+':'−'}</span>` + circles(b);
          host.append(visual);
        }
        numberChoices(host,options,answer,api);
      }
    };
  }
};
