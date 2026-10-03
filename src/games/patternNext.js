import { shuffle, node, button } from '../core/helpers.js';
import { t, copy } from '../core/i18n.js';
import { grid } from './shared.js';
const symbols=[{shape:'circle',color:'coral'},{shape:'square',color:'teal'},{shape:'triangle',color:'gold'},{shape:'diamond',color:'purple'}];
function visual(symbol) { const element=node('span',`pattern-symbol ${symbol.shape} ${symbol.color}`); element.setAttribute('aria-hidden','true'); return element; }
export const patternNext = {
  id:'patternNext',
  create({locale,level,rng}) {
    const [a,b]=shuffle(symbols,rng).slice(0,2);
    const pattern=level===3?[a,a,b,a,a]:[a,b,a,b];
    const answer=level===3?b:a;
    const options=shuffle([answer,...shuffle(symbols.filter(item=>item!==answer),rng).slice(0,2)],rng);
    return {
      prompt:t(locale,'patternNext'),
      render(host,api) {
        const line=node('div','pattern-line'); pattern.forEach(item=>line.append(visual(item))); line.append(node('span','pattern-question','?')); host.append(line);
        const area=grid(host,'pattern-choices');
        options.forEach(item=>{
          const element=button('choice pattern-choice',visual(item),()=>item===answer?api.complete():api.wrong(element));
          const names=copy[locale].patternNames;
          element.setAttribute('aria-label', `${names[item.color]} ${names[item.shape]}`); area.append(element);
        });
      }
    };
  }
};
