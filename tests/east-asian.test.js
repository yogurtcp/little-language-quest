import test from "node:test";
import assert from "node:assert/strict";
import { languages, copy } from "../src/core/i18n.js";
import { byId, concepts, alphabets, literacyRows, word } from "../src/core/content.js";
import { initialSpeech, quantitySpeech, mathSpeech } from "../src/core/speech.js";
import { letterOrder } from "../src/games/letterOrder.js";
import { seeded } from "../src/core/helpers.js";
import { readProgress, award } from "../src/core/rewards.js";
import { readFileSync } from "node:fs";

function checkShape(expected, actual, path) {
  assert.ok(actual != null, path);
  assert.equal(typeof actual, typeof expected, path);
  if (Array.isArray(expected)) assert.equal(actual.length, expected.length, path);
  else if (expected && typeof expected === "object")
    for (const [key, value] of Object.entries(expected)) checkShape(value, actual[key], `${path}.${key}`);
}
test("all five languages have flags and complete UI translations", () => {
  assert.deepEqual(languages.map((language) => language.code), ["ru", "he", "en", "zh", "ja"]);
  for (const language of languages) assert.match(language.flag, /^[\u{1F1E6}-\u{1F1FF}]{2}$/u);
  for (const locale of ["zh", "ja"]) checkShape(copy.en, copy[locale], locale);
});
test("Chinese pinyin units preserve digraphs; Japanese words start with their displayed kana", () => {
  assert.equal(byId.pig.words.zh.initial, "zh");
  assert.equal(byId.window.words.zh.initial, "ch");
  assert.equal(byId.tree.words.zh.initial, "sh");
  assert.equal(byId.moon.words.zh.initial, "y");
  assert.equal(byId.banana.words.ja.initial, "ば");
  for (const item of concepts) {
    assert.match(word(item, "zh").display, /^\p{Script=Han}+$/u, item.id);
    assert.ok(word(item, "zh").reading, item.id);
    assert.match(word(item, "ja").display, /^[\p{Script=Hiragana}ー]+$/u, item.id);
    assert.equal(word(item, "ja").initial, [...word(item, "ja").display][0], item.id);
  }
  for (const letter of alphabets.zh) assert.doesNotMatch(initialSpeech("zh", letter), /[a-zA-Z]/);
});
test("ordering tasks remain within native teaching rows at every difficulty", () => {
  for (const locale of ["zh", "ja"])
    for (const level of [1, 2, 3])
      for (let seed = 0; seed < 100; seed++) {
        const { answer } = letterOrder.create({ locale, level, rng: seeded(seed) });
        assert.equal(answer.length, level === 3 ? 4 : 3);
        assert.ok(literacyRows[locale].some((row) => {
          const start = row.indexOf(answer[0]);
          return start >= 0 && row.slice(start, start + answer.length).join("|") === answer.join("|");
        }));
      }
});
test("counting uses Mandarin classifiers and Japanese counters, while arithmetic uses plain numbers", () => {
  assert.match(quantitySpeech("zh", "countGroup", 2), /两个圆圈/);
  assert.match(quantitySpeech("zh", "makeAmount", 2), /两颗星星/);
  for (const [n, spoken] of [[1,"いっこ"],[6,"ろっこ"],[8,"はっこ"],[10,"じゅっこ"]])
    assert.ok(quantitySpeech("ja", "countGroup", n).includes(spoken));
  assert.equal(mathSpeech("zh", 2, 4, true)[0], "二");
  assert.equal(mathSpeech("ja", 6, 4, false)[0], "ろく");
});
test("existing stars survive migration and new language progress survives a reload", () => {
  const saved = new Map([["little-language-quest-progress-v1", JSON.stringify({correct:12, celebrations:0, byLocale:{ru:7, he:5, en:0}, skills:{"he:countGroup":8}})]]);
  globalThis.localStorage = { getItem:(key) => saved.get(key) ?? null, setItem:(key,value) => saved.set(key,value) };
  let progress = readProgress();
  assert.equal(progress.correct, 12);
  assert.equal(progress.byLocale.he, 5);
  assert.equal(progress.byLocale.zh, 0);
  assert.equal(progress.byLocale.ja, 0);
  progress = award(progress, "zh", "firstLetter").progress;
  progress = award(progress, "ja", "countGroup").progress;
  assert.deepEqual(readProgress(), progress);
  assert.equal(progress.skills["he:countGroup"], 8);
  assert.equal(progress.skills["zh:firstLetter"], 1);
  assert.equal(progress.skills["ja:countGroup"], 1);
});
test("both new locale modules ship in the offline shell", () => {
  const worker = readFileSync(new URL("../sw.js", import.meta.url), "utf8");
  for (const locale of ["zh", "ja"]) assert.ok(worker.includes(`./src/locales/${locale}.js`));
});
