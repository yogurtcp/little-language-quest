import { randomInt, shuffle } from '../core/helpers.js';
import { t } from '../core/i18n.js';
import { equation, numberChoices } from './shared.js';
export const missingNumber = {
  id:'missingNumber',
  create({locale,level,rng}) {
    const max=level===1?5:10;
    const start=randomInt(0,max-3,rng);
    const descending=level>1&&rng()<0.4;
    const sequence=descending?[start+3,start+2,start+1,start]:[start,start+1,start+2,start+3];
    const gap=randomInt(1,2,rng), answer=sequence[gap];
    const options=shuffle([answer,...shuffle(Array.from({length:max+1},(_,i)=>i).filter(n=>n!==answer),rng).slice(0,2)],rng);
    return {
      prompt:t(locale,'missingNumber'),
      render(host,api) { equation(host,sequence.map((n,i)=>i===gap?'?':n).join('  ·  ')); numberChoices(host,options,answer,api); }
    };
  }
};
