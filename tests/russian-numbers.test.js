import test from "node:test";
import assert from "node:assert/strict";
import {
  quantitySpeech,
  mathSpeech,
  comparisonSpeech,
} from "../src/core/speech.js";
import { countGroup } from "../src/games/countGroup.js";
import { makeAmount } from "../src/games/makeAmount.js";
import { seeded } from "../src/core/helpers.js";
import { audioManifest } from "../src/core/audio-manifest.js";

test("Russian counting uses complete phrases with correct gender, case, and number", () => {
  const circles = [
    "один кружок",
    "два кружка",
    "три кружка",
    "четыре кружка",
    "пять кружков",
    "шесть кружков",
    "семь кружков",
    "восемь кружков",
    "девять кружков",
    "десять кружков",
  ];
  const stars = [
    "одну звезду",
    "две звезды",
    "три звезды",
    "четыре звезды",
    "пять звёзд",
    "шесть звёзд",
    "семь звёзд",
    "восемь звёзд",
    "девять звёзд",
    "десять звёзд",
  ];
  for (let n = 1; n <= 10; n++) {
    assert.equal(
      quantitySpeech("ru", "countGroup", n),
      `Где ${circles[n - 1]}?`,
    );
    assert.equal(
      quantitySpeech("ru", "makeAmount", n),
      `Сделай ${stars[n - 1]}. Нажимай на плюс или минус.`,
    );
  }
});
test("every reachable Russian counting target uses the inflected recording for autoplay and replay", () => {
  for (const game of [countGroup, makeAmount])
    for (let n = game === countGroup ? 1 : 2; n <= 10; n++) {
      const task = game.create({
        locale: "ru",
        level: 3,
        rng: seeded(n),
        choose: () => n,
      });
      assert.equal(task.speech, quantitySpeech("ru", game.id, n));
      assert.doesNotMatch(task.speech, /\d/);
      assert.ok(audioManifest.ru[task.speech]);
      assert.notEqual(task.prompt, task.speech);
    }
});
test("abstract arithmetic and comparisons still use the standard standalone number name", () => {
  assert.deepEqual(mathSpeech("ru", 2, 4, true), [
    "два",
    "плюс",
    "четыре",
    "Сколько получится?",
  ]);
  assert.deepEqual(comparisonSpeech("ru", 2, 7), [
    "два",
    "и",
    "семь",
    "Какой знак подходит?",
  ]);
});
