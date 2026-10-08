import { languages } from "../src/core/i18n.js";
const locales = languages.map(({ code }) => code);
import test from "node:test";
import assert from "node:assert/strict";
import { parseHTML } from "linkedom";
import { memoryPairs } from "../src/games/memoryPairs.js";
import { seeded } from "../src/core/helpers.js";
import { byId, word } from "../src/core/content.js";

function setup(locale, level) {
  const { document } = parseHTML("<main></main>");
  globalThis.document = document;
  const task = memoryPairs.create({ locale, level, rng: seeded(1) });
  const host = document.querySelector("main"),
    timers = [],
    spoken = [];
  let wins = 0;
  task.render(host, {
    locale,
    audio: { speak: (text) => spoken.push(text) },
    wrong() {},
    later: (fn) => timers.push(fn),
    complete: () => wins++,
  });
  return {
    task,
    buttons: [...host.querySelectorAll("button")],
    timers,
    spoken,
    get wins() {
      return wins;
    },
  };
}

test("a tap during mismatch preview immediately reveals that card; stale timers cannot hide it", () => {
  for (const locale of locales)
    for (const level of [1, 2, 3]) {
      const f = setup(locale, level),
        cards = f.task.cards;
      const first = 0,
        second = cards.findIndex((card) => card.id !== cards[first].id);
      const third = cards.findIndex((_, i) => i !== first && i !== second);
      f.buttons[first].click();
      f.buttons[second].click();
      const oldTimer = f.timers[0];
      f.buttons[third].click();
      const expected = word(byId[cards[third].id], locale);
      assert.equal(
        f.buttons[third].getAttribute("aria-label"),
        expected.display,
      );
      assert.equal(f.spoken.at(-1), expected.speech);
      assert.equal(f.buttons[first].getAttribute("aria-label"), "?");
      assert.equal(f.buttons[second].getAttribute("aria-label"), "?");
      oldTimer();
      assert.equal(
        f.buttons[third].getAttribute("aria-label"),
        expected.display,
      );
      const partner = cards.findIndex(
        (card, i) => i !== third && card.id === cards[third].id,
      );
      f.buttons[partner].click();
      assert.ok(f.buttons[third].classList.contains("matched"));
      oldTimer();
      assert.ok(f.buttons[third].classList.contains("matched"));
      for (const id of new Set(cards.map((card) => card.id)))
        if (id !== cards[third].id)
          cards.forEach((card, i) => {
            if (card.id === id) f.buttons[i].click();
          });
      assert.equal(f.wins, 1);
    }
});

test("a newer mismatch keeps its own preview when an older timer fires", () => {
  const f = setup("ru", 3),
    cards = f.task.cards;
  const a = 0,
    b = cards.findIndex((card) => card.id !== cards[a].id);
  const c = cards.findIndex((_, i) => i !== a && i !== b);
  const d = cards.findIndex((card, i) => i !== c && card.id !== cards[c].id);
  f.buttons[a].click();
  f.buttons[b].click();
  const old = f.timers[0];
  f.buttons[c].click();
  f.buttons[d].click();
  old();
  assert.notEqual(f.buttons[c].getAttribute("aria-label"), "?");
  assert.notEqual(f.buttons[d].getAttribute("aria-label"), "?");
  f.timers[1]();
  assert.equal(f.buttons[c].getAttribute("aria-label"), "?");
  assert.equal(f.buttons[d].getAttribute("aria-label"), "?");
  f.buttons[c].click();
  assert.notEqual(f.buttons[c].getAttribute("aria-label"), "?");
});

test("tapping an open card turns it face down, and matched cards stop responding", () => {
  for (const locale of locales) {
    const f = setup(locale, 1),
      cards = f.task.cards;
    const first = 0;
    const partner = cards.findIndex(
      (card, index) => index !== first && card.id === cards[first].id,
    );
    f.buttons[first].click();
    assert.equal(f.buttons[first].getAttribute("aria-pressed"), "true");
    f.buttons[first].click();
    assert.equal(f.buttons[first].getAttribute("aria-label"), "?");
    assert.equal(f.buttons[first].getAttribute("aria-pressed"), "false");
    f.buttons[first].click();
    f.buttons[partner].click();
    assert.equal(f.buttons[first].disabled, true);
    assert.equal(f.buttons[partner].disabled, true);
    assert.equal(f.buttons[first].getAttribute("aria-pressed"), "true");
  }
});

test("tapping a card in a mismatched pair turns it face down immediately", () => {
  const f = setup("ru", 1),
    cards = f.task.cards;
  const second = cards.findIndex((card) => card.id !== cards[0].id);
  f.buttons[0].click();
  f.buttons[second].click();
  f.buttons[0].click();
  assert.equal(f.buttons[0].getAttribute("aria-label"), "?");
  assert.equal(f.buttons[second].getAttribute("aria-label"), "?");
  f.timers[0]();
  f.buttons[0].click();
  assert.notEqual(f.buttons[0].getAttribute("aria-label"), "?");
});
