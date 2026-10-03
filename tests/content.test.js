import test from 'node:test';
import assert from 'node:assert/strict';
import { concepts, groups, alphabets } from '../src/core/content.js';
import { games } from '../src/games/index.js';
import { seeded } from '../src/core/helpers.js';

test('all pictured words have three complete language entries and distinct IDs', () => {
  assert.equal(new Set(concepts.map(item=>item.id)).size, concepts.length);
  for (const item of concepts) for (const locale of ['ru','he','en']) {
    const entry=item.words[locale];
    assert.ok(entry.display && entry.speech && entry.initial, `${item.id}/${locale}`);
    assert.ok(alphabets[locale].includes(entry.initial), `${item.id}/${locale} initial`);
  }
});

test('Hebrew vocabulary includes niqqud and each locale can make initial-letter tasks', () => {
  for (const item of concepts) assert.match(item.words.he.display,/[\u0591-\u05c7]/,item.id);
  for (const locale of ['ru','he','en']) assert.ok(groups(locale).length > 0,locale);
});

test('every game generates tasks in every language and difficulty', () => {
  assert.equal(games.length,12);
  for (const game of games) for (const locale of ['ru','he','en']) for (const level of [1,2,3]) {
    for (let seed=1;seed<=20;seed++) {
      const task=game.create({locale,level,rng:seeded(seed)});
      assert.equal(typeof task.prompt,'string',`${game.id}/${locale}/${level}`);
      assert.ok(task.prompt.length>3,`${game.id}/${locale}/${level}`);
      assert.equal(typeof task.render,'function',game.id);
    }
  }
});
