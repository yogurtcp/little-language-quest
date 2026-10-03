import { randomInt, node, button } from '../core/helpers.js';
import { t } from '../core/i18n.js';
export const makeAmount = {
  id:'makeAmount',
  create({locale,level,rng}) {
    const max=level===1?5:10;
    const target=randomInt(2,max,rng);
    const start=randomInt(0,target-1,rng);
    return {
      prompt:t(locale,'makeAmount',target),
      render(host,api) {
        let count=start;
        const row=node('div','make-row');
        const minus=button('round-control','−',()=>change(-1));
        const stars=node('div','make-stars');
        const plus=button('round-control','+',()=>change(1));
        row.append(minus,stars,plus); host.append(row);
        const number=node('div','make-number'); host.append(number);
        function draw() { stars.textContent='★'.repeat(count); number.textContent=`${count} / ${target}`; minus.disabled=count===0; }
        function change(delta) {
          count+=delta; draw();
          if (count===target) api.complete();
          else if (count>target) api.wrong(plus);
        }
        draw();
      }
    };
  }
};
