import test from "node:test";
import assert from "node:assert/strict";
import { readProgress, resetProgress, award } from "../src/core/rewards.js";

const values = new Map();
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
};

test("five completed tasks earn a star; five stars celebrate; mistakes cannot reduce progress", () => {
  let progress = resetProgress();
  for (let i = 1; i <= 25; i++) {
    const result = award(progress, i % 2 ? "ru" : "he");
    progress = result.progress;
    assert.equal(result.star, i % 5 === 0);
    assert.equal(result.celebrate, i === 25);
  }
  assert.equal(progress.correct, 25);
  assert.equal(progress.celebrations, 1);
  assert.deepEqual(readProgress(), progress);
});

test("storage failures and malformed saved progress do not stop play", async () => {
  const { readProgress, award } = await import("../src/core/rewards.js");
  globalThis.localStorage = {
    getItem() {
      throw new Error("disabled");
    },
    setItem() {
      throw new Error("full");
    },
  };
  const initial = readProgress();
  assert.equal(initial.correct, 0);
  const result = award(initial, "ru", "describe", 0);
  assert.equal(result.progress.correct, 1);
  assert.equal(result.progress.skills["ru:describe"], 1);
  globalThis.localStorage = {
    getItem() {
      return '{"correct":-3,"byLocale":{"ru":"bad"},"skills":{}}';
    },
    setItem() {},
  };
  assert.equal(readProgress().correct, 0);
  assert.equal(readProgress().byLocale.ru, 0);
});
