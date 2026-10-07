import test from "node:test";
import assert from "node:assert/strict";
import { parseHTML } from "linkedom";
import { games } from "../src/games/index.js";
import { seeded } from "../src/core/helpers.js";
import { concepts, byId, word } from "../src/core/content.js";
import { art, artworkIds } from "../src/core/art.js";
import { clues } from "../src/core/clues.js";
import { TaskScheduler } from "../src/core/scheduler.js";
import { TaskLifetime } from "../src/core/lifecycle.js";
import { audioManifest } from "../src/core/audio-manifest.js";
import { speechCatalog } from "../src/core/speech.js";
import { readFileSync, statSync } from "node:fs";

test("all 86 words have distinct pixel artwork and all 50 clues have unambiguous pools", () => {
  assert.equal(concepts.length, 86);
  assert.equal(clues.length, 50);
  assert.deepEqual(
    new Set(artworkIds),
    new Set(concepts.map((item) => item.id)),
  );
  assert.equal(new Set(concepts.map((item) => art(item.id))).size, 86);
  for (const clue of clues) {
    assert.ok(clue.answers.length && clue.distractors.length >= 3);
    for (const id of [...clue.answers, ...clue.distractors])
      assert.ok(byId[id], `${clue.id}/${id}`);
    assert.equal(
      new Set([...clue.answers, ...clue.distractors]).size,
      clue.answers.length + clue.distractors.length,
    );
    for (const locale of ["ru", "he", "en"]) assert.ok(clue.prompts[locale]);
  }
});
test("activity rounds cover every game; all clues and listening words cycle before repeats", () => {
  const scheduler = new TaskScheduler();
  scheduler.history = {};
  for (const locale of ["ru", "he", "en"]) {
    let last = null;
    for (let round = 0; round < 4; round++) {
      const ids = Array.from(
        { length: 12 },
        () => scheduler.next(games, locale, 1).game.id,
      );
      assert.equal(new Set(ids).size, 12);
      assert.notEqual(ids[0], last);
      last = ids.at(-1);
    }
    for (const [key, pool] of [
      ["clues", clues],
      ["words", concepts],
    ]) {
      const seen = Array.from(
        { length: pool.length },
        () => scheduler.choose(locale, `test:${key}`, pool, Math.random).id,
      );
      assert.equal(new Set(seen).size, pool.length);
      assert.notEqual(
        scheduler.choose(locale, `test:${key}`, pool, Math.random).id,
        seen.at(-1),
      );
    }
  }
});
function fixture(task, locale) {
  const { document } = parseHTML("<html><body><main></main></body></html>");
  globalThis.document = document;
  const host = document.querySelector("main");
  let wins = 0,
    misses = 0,
    done = false,
    spoken = [];
  const later = [];
  const api = {
    locale,
    audio: {
      speak(text) {
        spoken.push(text);
      },
    },
    isComplete: () => done,
    later(fn) {
      later.push(fn);
    },
    wrong() {
      misses++;
    },
    complete() {
      if (!done) {
        wins++;
        done = true;
        for (const b of host.querySelectorAll("button")) b.disabled = true;
      }
    },
  };
  task.render(host, api);
  return {
    host,
    api,
    later,
    spoken,
    get wins() {
      return wins;
    },
    get misses() {
      return misses;
    },
  };
}
test("all games can be completed in all languages and levels; answers reveal full words", () => {
  for (const game of games)
    for (const locale of ["ru", "he", "en"])
      for (const level of [1, 2, 3])
        for (let seed = 1; seed <= 10; seed++) {
          const task = game.create({ locale, level, rng: seeded(seed) }),
            f = fixture(task, locale),
            buttons = [...f.host.querySelectorAll("button")];
          const clickText = (text) => {
            const button = buttons.find(
              (button) => button.textContent === String(text),
            );
            assert.ok(button, `${game.id}: ${text}`);
            button.click();
          };
          if (game.id === "initialSet") {
            const wrong = task.options.find((id) => !task.answers.includes(id));
            buttons[task.options.indexOf(wrong)].click();
            assert.equal(f.misses, 1);
            task.answers.forEach((id, index) => {
              buttons[task.options.indexOf(id)].click();
              assert.equal(
                f.host.querySelectorAll(".picture-word").length,
                index + 1,
              );
            });
          } else if (["describe", "listenChoose"].includes(game.id)) {
            buttons[task.options.indexOf(task.answer)].click();
            assert.equal(
              f.host.querySelector(".picture-word").textContent,
              word(byId[task.answer], locale).display,
            );
          } else if (game.id === "firstLetter") {
            clickText(task.answer);
            assert.equal(
              f.host.querySelector(".picture-word").textContent,
              word(byId[task.key], locale).display,
            );
          } else if (game.id === "memoryPairs") {
            const first = task.cards[0],
              wrongIndex = task.cards.findIndex((card) => card.id !== first.id);
            buttons[0].click();
            buttons[wrongIndex].click();
            assert.equal(f.misses, 1);
            f.later.forEach((fn) => fn());
            assert.equal(buttons[0].getAttribute("aria-label"), "?");
            for (const id of new Set(task.cards.map((card) => card.id)))
              task.cards.forEach((card, index) => {
                if (card.id === id) buttons[index].click();
              });
            assert.equal(
              f.host.querySelectorAll(".picture-word").length,
              new Set(task.cards.map((card) => card.id)).size,
            );
          } else if (game.id === "letterOrder") task.answer.forEach(clickText);
          else if (game.id === "countGroup")
            buttons[task.options.indexOf(task.answer)].click();
          else if (game.id === "patternNext")
            buttons[task.options.indexOf(task.answer)].click();
          else if (game.id === "makeAmount") {
            for (
              let n = task.start;
              n !== task.answer;
              n += task.start < task.answer ? 1 : -1
            )
              buttons[task.start < task.answer ? 1 : 0].click();
          } else clickText(task.answer);
          assert.equal(f.wins, 1, `${game.id}/${locale}/${level}/${seed}`);
        }
});
test("every generated instruction has bundled narration, including Hebrew niqqud", () => {
  for (const locale of ["ru", "he", "en"]) {
    for (const text of speechCatalog(locale))
      assert.ok(audioManifest[locale][text], `${locale}: ${text}`);
    for (const game of games)
      for (const level of [1, 2, 3])
        for (let seed = 1; seed <= 100; seed++) {
          const task = game.create({ locale, level, rng: seeded(seed) });
          for (const text of [task.speech || task.prompt].flat())
            assert.ok(
              audioManifest[locale][text],
              `${game.id}/${locale}: ${text}`,
            );
        }
  }
});
test("each audio asset exists and is nonempty; service-worker shell has every module", () => {
  for (const entries of Object.values(audioManifest))
    for (const path of Object.values(entries))
      assert.ok(
        statSync(new URL(`../${path}`, import.meta.url)).size > 1000,
        path,
      );
  const sw = readFileSync(new URL("../sw.js", import.meta.url), "utf8");
  for (const file of [
    "src/core/audio-manifest.js",
    "src/core/clues.js",
    "src/core/pixel-art.js",
    "src/ui/parents.js",
    "src/core/lifecycle.js",
  ])
    assert.ok(sw.includes(`./${file}`), file);
});
test("leaving a task cancels its delayed callbacks", async () => {
  const lifetime = new TaskLifetime();
  let called = false;
  lifetime.later(() => {
    called = true;
  }, 10);
  lifetime.dispose();
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(called, false);
});
