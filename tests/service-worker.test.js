import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
test("worker caches every shell asset and leaves unrelated origin caches untouched", async () => {
  const handlers = {},
    removed = [],
    core = [];
  const cache = { addAll: async (paths) => core.push(...paths) };
  const sandbox = {
    URL,
    Promise,
    self: {
      registration: { scope: "https://example.com/little-language-quest/" },
      addEventListener: (name, fn) => (handlers[name] = fn),
      skipWaiting: async () => {},
      clients: { claim: async () => {} },
    },
    caches: {
      open: async () => cache,
      keys: async () => [
        "another-project-cache",
        "llq-v4",
        "little-language-quest-shell-v4",
        "little-language-quest-shell-v5",
        "little-language-quest-audio-v1",
      ],
      delete: async (key) => removed.push(key),
    },
  };
  vm.runInNewContext(
    readFileSync(new URL("../sw.js", import.meta.url), "utf8"),
    sandbox,
  );
  let pending;
  handlers.install({ waitUntil: (p) => (pending = p) });
  await pending;
  for (const path of core)
    assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), path);
  handlers.activate({ waitUntil: (p) => (pending = p) });
  await pending;
  assert.deepEqual(removed, ["llq-v4", "little-language-quest-shell-v4"]);
  let intercepted = false;
  handlers.fetch({
    request: { method: "GET", url: "https://example.com/other-app/" },
    respondWith() {
      intercepted = true;
    },
  });
  assert.equal(intercepted, false);
});
