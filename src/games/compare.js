import { randomInt, shuffle } from '../core/helpers.js';
import { t } from '../core/i18n.js';
import { circles } from '../core/art.js';
import { equation, grid, tile } from './shared.js';
export const compare = {
  id: 'compare',
  create({ locale, level, rng }) {
    const max = level === 1 ? 5 : 10;
    const a = randomInt(1,max,rng);
    let b = randomInt(1,max,rng);
    if (level < 3) while (b === a) b = randomInt(1,max,rng);
    const answer = a < b ? '<' : a > b ? '>' : '=';
    return {
      prompt: t(locale,'compare'),
      speech: t(locale,'compareSpeech',a,b),
      render(host,api) {
        equation(host,`${a} ? ${b}`);
        if (level === 1) { const visual=document.createElement('div'); visual.className='math-visual'; visual.dir='ltr'; visual.innerHTML=circles(a)+'<span>?</span>'+circles(b); host.append(visual); }
        const area=grid(host,'number-choices');
        shuffle(['<','>','='],rng).forEach(symbol=>{
          const element=tile(symbol,()=>symbol===answer?api.complete():api.wrong(element),'symbol-tile');
          area.append(element);
        });
      }
    };
  }
};
