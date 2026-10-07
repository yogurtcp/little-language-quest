import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { readFileSync } from 'node:fs';
import { letterOrder } from '../src/games/letterOrder.js';
import { firstLetter } from '../src/games/firstLetter.js';
import { TaskScheduler } from '../src/core/scheduler.js';
import { seeded } from '../src/core/helpers.js';

test('Hebrew letter games keep Hebrew options after switching from Russian and English', () => {
  globalThis.document = parseHTML('<html><body></body></html>').document;
  const scheduler = new TaskScheduler();
  for (const game of [letterOrder, firstLetter]) {
    for (const level of [1, 2, 3]) {
      for (let seed = 1; seed <= 100; seed++) {
        for (const locale of ['ru', 'he', 'en', 'he']) {
          const rng = seeded(seed);
          const choose = (key, pool) => scheduler.choose(locale, `${game.id}:${key}`, pool, rng);
          const task = game.create({locale, level, rng, choose});
          const host = document.createElement('div');
          task.render(host, {locale, audio:{speak(){}}, wrong(){}, complete(){}, encourage(){}});
          if (locale !== 'he') continue;
          for (const tile of host.querySelectorAll('.letter-tile')) {
            assert.match(tile.textContent, /^[א-ת]$/, `${game.id}/${level}/${seed}`);
            assert.equal(tile.getAttribute('translate'), 'no');
          }
          assert.doesNotMatch(host.textContent + task.prompt, /\p{Script=Cyrillic}/u);
          if (game.id === 'letterOrder') {
            for (const letter of task.answer)
              [...host.querySelectorAll('.letter-tile')].find(tile => tile.textContent === letter).click();
            assert.equal(host.querySelector('.answer-line').textContent, task.answer.join(''));
          }
        }
      }
    }
  }
});

test('the language-learning app opts out of automatic page translation', () => {
  const {document} = parseHTML(readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
  assert.equal(document.documentElement.getAttribute('translate'), 'no');
  assert.equal(document.querySelector('meta[name="google"]').getAttribute('content'), 'notranslate');
});
