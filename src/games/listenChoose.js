import { concepts, word } from '../core/content.js';
import { pick, sample, shuffle } from '../core/helpers.js';
import { t } from '../core/i18n.js';
import { grid, picture } from './shared.js';
export const listenChoose = {
  id: 'listenChoose',
  create({ locale, rng }) {
    const answer=pick(concepts,rng);
    const options=shuffle([answer,...sample(concepts.filter(item=>item.id!==answer.id),3,rng)],rng);
    return {
      prompt:t(locale,'listenChoose'),
      speech:`${t(locale,'listenChoose')} ${word(answer,locale).speech}`,
      render(host,api) {
        const area=grid(host,'picture-grid');
        options.forEach(item=>{
          const element=picture(item,locale,()=>item.id===answer.id?api.complete():api.wrong(element));
          area.append(element);
        });
      }
    };
  }
};
