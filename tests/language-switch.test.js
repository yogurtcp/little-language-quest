import test from "node:test";
import assert from "node:assert/strict";
import { parseHTML } from "linkedom";
import { GameAudio } from "../src/core/audio.js";
import { languages, direction } from "../src/core/i18n.js";
import { initial as arabicInitial } from "../src/locales/ar.js";
import { initial as turkishInitial } from "../src/locales/tr.js";
import { alphabets } from "../src/core/content.js";
import { letterOrder } from "../src/games/letterOrder.js";
import { seeded } from "../src/core/helpers.js";
import { readProgress, award } from "../src/core/rewards.js";

test("Arabic base letters, Turkish dotted letters, and native ordering use the right writing system", () => {
  assert.equal(arabicInitial("أَرْنَب"), "ا");
  assert.equal(arabicInitial("إِبْرَة"), "ا");
  assert.equal(arabicInitial("كَلْب"), "ك");
  assert.equal(turkishInitial("inek"), "İ");
  assert.equal(turkishInitial("ıhlamur"), "I");
  assert.equal(turkishInitial("çilek"), "Ç");
  assert.equal(alphabets.tr.length, 29);
  assert.equal(alphabets.ar.length, 28);
  for (const locale of ["ar", "tr"]) {
    const { document } = parseHTML("<main></main>");
    globalThis.document = document;
    const task = letterOrder.create({ locale, level: 3, rng: seeded(4) });
    const host = document.querySelector("main");
    task.render(host, { complete() {}, wrong() {} });
    assert.equal(host.querySelector(".answer-line").dir, direction(locale));
  }
});

test("a child can switch language from a running game without the adult gate or losing stars", async () => {
  const { document, window } = parseHTML('<html><body><div id="app"></div></body></html>');
  globalThis.document = document;
  globalThis.window = window;
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: {} });
  globalThis.location = { hostname: "localhost" };
  window.scrollTo = () => {};
  window.matchMedia = () => ({ matches: false });
  const saved = new Map([["little-language-quest-progress-v1", JSON.stringify({correct: 12, celebrations: 0, byLocale: {en: 12}, skills: {"en:firstLetter": 8}})]]);
  globalThis.localStorage = { getItem: (key) => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
  let stops = 0;
  const oldStop = GameAudio.prototype.stop, oldSpeak = GameAudio.prototype.speak;
  GameAudio.prototype.stop = function () { stops++; this.onStatus("idle"); };
  GameAudio.prototype.speak = async () => true;
  try {
    await import("../src/main.js");
    const choose = (code) => {
      const buttons = [...document.querySelectorAll(".language-choice")];
      assert.deepEqual(buttons.map((button) => button.lang), languages.map(({tag}) => tag));
      buttons.find((button) => button.lang === languages.find((language) => language.code === code).tag).click();
    };
    choose("en");
    document.querySelector(".play-button").click();
    assert.ok(document.querySelector(".game-screen"));
    let previousStage = document.querySelector(".stage");
    const savedBefore = saved.get("little-language-quest-progress-v1");
    for (const code of ["ar", "tr", "zh", "he", "en"]) {
      const previousStops = stops;
      document.querySelector(".language-switch").click();
      assert.equal(document.querySelectorAll("dialog").length, 0);
      assert.equal(document.querySelectorAll(".game-screen").length, 0);
      assert.ok(stops > previousStops, "old narration stops when opening language choices");
      choose(code);
      assert.ok(document.querySelector(".game-screen"), "new language starts a question directly");
      assert.notEqual(document.querySelector(".stage"), previousStage);
      previousStage = document.querySelector(".stage");
      assert.equal(document.documentElement.dir, direction(code));
      assert.equal(document.documentElement.lang, languages.find((language) => language.code === code).tag);
      assert.equal(document.querySelector(".star-count").textContent, "2");
      assert.equal(saved.get("little-language-quest-progress-v1"), savedBefore);
    }
    const progress = readProgress();
    assert.equal(progress.byLocale.ar, 0);
    assert.equal(progress.byLocale.tr, 0);
    award(progress, "ar", "countGroup");
    assert.equal(readProgress().byLocale.ar, 1);
    assert.equal(readProgress().skills["en:firstLetter"], 8);
  } finally {
    GameAudio.prototype.stop = oldStop;
    GameAudio.prototype.speak = oldSpeak;
  }
});
