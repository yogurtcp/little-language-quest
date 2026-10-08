import test from "node:test";
import assert from "node:assert/strict";
import { parseHTML } from "linkedom";
import { createReaction, reactionStates, reactionFiles, REACTION_FOCUS_MS, REACTION_SETTLE_MS } from "../src/ui/reactions.js";
import { existsSync, statSync } from "node:fs";

test("older reaction timers cannot overwrite success or a new screen", () => {
  globalThis.document = parseHTML("<html><body></body></html>").document;
  const timers = [];
  const lifetime = { alive: true, later(fn) { timers.push(fn); } };
  const reaction = createReaction("thinking", { lifetime, preview: true });
  reaction.set("oops", 1500);
  reaction.element.querySelector("img").onload();
  reaction.set("happy");
  timers[0]();
  assert.equal(reaction.element.dataset.reaction, "happy");
  reaction.set("sad", 1500);
  reaction.element.querySelector("img").onload();
  timers[1]();
  assert.equal(reaction.element.dataset.reaction, "thinking");
  reaction.set("oops", 1500);
  reaction.element.querySelector("img").onload();
  lifetime.alive = false;
  timers[2]();
  assert.equal(reaction.element.dataset.reaction, "oops");
});

test("all reaction assets exist and stay below a small combined download budget", () => {
  let total = 0;
  for (const state of reactionStates) {
    const path = new URL(`../assets/reactions/${reactionFiles[state]}`, import.meta.url);
    assert.ok(existsSync(path));
    total += statSync(path).size;
  }
  assert.ok(total < 200 * 1024, `Portraits total ${total} bytes`);
});

test("brief reactions remain visible throughout the two-second enlargement", () => {
  globalThis.document = parseHTML("<html><body></body></html>").document;
  const delays = [];
  const lifetime = { alive: true, later(_fn, delay) { delays.push(delay); } };
  const reaction = createReaction("thinking", { lifetime, preview: true });
  reaction.set("sad", 100);
  assert.equal(delays.length, 0, "Do not spend the two-second hold waiting for the download");
  reaction.element.querySelector("img").onload();
  reaction.set("oops", 2400);
  reaction.element.querySelector("img").onload();
  assert.deepEqual(delays, [REACTION_FOCUS_MS + REACTION_SETTLE_MS, 2400]);
  assert.equal(reaction.element.dataset.reaction, "oops");
});
