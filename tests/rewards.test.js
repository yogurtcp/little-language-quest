import test from 'node:test';
import assert from 'node:assert/strict';
import { readProgress, resetProgress, award } from '../src/core/rewards.js';

const values = new Map();
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key,value) => values.set(key,value)
};

test('five completed tasks earn a star; five stars celebrate; mistakes cannot reduce progress', () => {
  let progress=resetProgress();
  for(let i=1;i<=25;i++) {
    const result=award(progress,i%2?'ru':'he');
    progress=result.progress;
    assert.equal(result.star,i%5===0);
    assert.equal(result.celebrate,i===25);
  }
  assert.equal(progress.correct,25);
  assert.equal(progress.celebrations,1);
  assert.deepEqual(readProgress(),progress);
});
