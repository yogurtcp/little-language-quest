import { concepts, word } from '../core/content.js';
import { sample, shuffle, node, button } from '../core/helpers.js';
import { art } from '../core/art.js';
import { t } from '../core/i18n.js';
import { grid } from './shared.js';
export const memoryPairs = {
  id: 'memoryPairs',
  create({ locale, level, rng }) {
    const selected = sample(concepts, level === 1 ? 2 : level === 2 ? 3 : 4, rng);
    const cards = shuffle(selected.flatMap(item => [{id:item.id,kind:'art',item},{id:item.id,kind:'word',item}]),rng);
    return {
      prompt: t(locale,'memoryPairs'),
      render(host, api) {
        const area = grid(host,'memory-grid');
        let open = [], matched = new Set(), busy = false;
        const elements = cards.map(card => {
          const element = button('choice memory-card', '', () => {
            if (busy || matched.has(card.id) || open.some(x=>x.element===element)) return;
            reveal(element,card);
            open.push({card,element});
            if (card.kind === 'word') api.audio.speak(word(card.item,locale).speech, locale);
            if (open.length === 2) {
              const [first,second] = open;
              if (first.card.id === second.card.id && first.card.kind !== second.card.kind) {
                matched.add(card.id);
                first.element.classList.add('matched'); second.element.classList.add('matched');
                open = [];
                if (matched.size === selected.length) api.complete();
              } else {
                busy = true;
                api.wrong(null, false);
                setTimeout(() => { first.element.innerHTML = '<span class="card-back">?</span>'; second.element.innerHTML = '<span class="card-back">?</span>'; open = []; busy = false; }, 850);
              }
            }
          });
          element.innerHTML = '<span class="card-back">?</span>';
          element.setAttribute('aria-label', '?');
          return element;
        });
        elements.forEach(element=>area.append(element));
        function reveal(element,card) {
          element.innerHTML = card.kind === 'art' ? art(card.item.art,word(card.item,locale).display) : '';
          if (card.kind === 'word') element.append(node('span','memory-word',word(card.item,locale).display));
          element.setAttribute('aria-label', word(card.item,locale).display);
        }
      }
    };
  }
};
