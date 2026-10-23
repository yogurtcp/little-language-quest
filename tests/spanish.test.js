import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { parseHTML } from "linkedom";
import { alphabet, initial, vocabulary } from "../src/locales/es.js";
import { languages } from "../src/core/i18n.js";
import { readProgress, award } from "../src/core/rewards.js";

test("Spanish removes vowel accents for initial letters while preserving Ñ", () => {
  assert.equal(alphabet.length, 27);
  assert.equal(initial(vocabulary.tree), "A");
  assert.equal(initial("ñandú"), "Ñ");
  assert.equal(initial("uña"), "U");
  assert.deepEqual(alphabet.slice(13, 17), ["N", "Ñ", "O", "P"]);
  assert.ok(!alphabet.includes("CH") && !alphabet.includes("LL"));
});
test("the independent update page offers every language in the same order with complete translations", () => {
  const html = readFileSync(new URL("../update.html", import.meta.url), "utf8");
  const { document } = parseHTML(html);
  assert.deepEqual([...document.querySelectorAll("option")].map((option) => option.value), languages.map(({ code }) => code));
  const script = document.querySelector("script").textContent;
  new vm.Script(script);
  const literal = script.slice(script.indexOf("const words=") + "const words=".length, script.indexOf(";\nconst select="));
  const copy = vm.runInNewContext(`(${literal})`);
  for (const { code } of languages)
    for (const key of ["title", "note", "button", "busy", "done", "failed", "play"])
      assert.ok(copy[code][key].length > 0, `${code}/${key}`);
});
test("adding Spanish preserves older stars and settings and saves its own progress", () => {
  const saved = new Map([
    ["little-language-quest-progress-v1", JSON.stringify({correct: 15, celebrations: 0, byLocale: {ar: 5, tr: 10}, skills: {"tr:countGroup": 8}})],
    ["llq-volume", "75"],
  ]);
  globalThis.localStorage = {getItem: (key) => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value)};
  const progress = readProgress();
  assert.equal(progress.correct, 15);
  assert.equal(progress.byLocale.es, 0);
  award(progress, "es", "firstLetter");
  const next = readProgress();
  assert.equal(next.correct, 16);
  assert.equal(next.byLocale.es, 1);
  assert.equal(next.byLocale.tr, 10);
  assert.equal(next.skills["tr:countGroup"], 8);
  assert.equal(saved.get("llq-volume"), "75");
});
