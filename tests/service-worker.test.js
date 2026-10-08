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
    Request,
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
        "little-language-quest-shell-v6",
        "little-language-quest-shell-v7",
        "little-language-quest-shell-v8",
        "little-language-quest-shell-v9",
        "little-language-quest-shell-v10",
        "little-language-quest-shell-v11",
        "little-language-quest-shell-v13",
        "little-language-quest-shell-v14",
        "little-language-quest-shell-v15",
        "little-language-quest-shell-v16",
        "little-language-quest-shell-v17",
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
  for (const request of core) {
    assert.equal(request.cache, "reload", "new releases must bypass stale HTTP cache entries");
    const path = new URL(request.url).pathname.replace("/little-language-quest/", "");
    assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), path);
  }
  handlers.activate({ waitUntil: (p) => (pending = p) });
  await pending;
  assert.deepEqual(removed, [
    "llq-v4",
    "little-language-quest-shell-v4",
    "little-language-quest-shell-v5",
    "little-language-quest-shell-v6",
    "little-language-quest-shell-v7",
    "little-language-quest-shell-v8",
    "little-language-quest-shell-v9",
    "little-language-quest-shell-v10",
    "little-language-quest-shell-v11",
    "little-language-quest-shell-v13",
    "little-language-quest-shell-v14",
    "little-language-quest-shell-v15",
    "little-language-quest-shell-v16",
  ]);
  let intercepted = false;
  handlers.fetch({
    request: { method: "GET", url: "https://example.com/other-app/" },
    respondWith() {
      intercepted = true;
    },
  });
  assert.equal(intercepted, false);
});

test("audio plays even if its cache is full; reload bypasses a stale cache", async () => {
  const handlers = {},
    requests = [],
    response = {
      ok: true,
      clone() {
        return this;
      },
    };
  const sandbox = {
    URL,
    Request,
    Promise,
    self: {
      registration: { scope: "https://example.com/game/" },
      addEventListener: (name, fn) => (handlers[name] = fn),
    },
    caches: {
      open: async () => ({
        match: async () => ({ stale: true }),
        put: async () => {
          throw new Error("quota");
        },
      }),
    },
    fetch: async (request) => {
      requests.push(request);
      return response;
    },
  };
  vm.runInNewContext(
    readFileSync(new URL("../sw.js", import.meta.url), "utf8"),
    sandbox,
  );
  let pending;
  handlers.fetch({
    request: {
      method: "GET",
      cache: "reload",
      url: "https://example.com/game/audio/ru/clip.mp3",
    },
    respondWith: (p) => (pending = p),
  });
  assert.equal(await pending, response);
  assert.equal(requests.length, 1);
  sandbox.caches.open = async () => {
    throw new Error("storage blocked");
  };
  handlers.fetch({
    request: {
      method: "GET",
      cache: "default",
      url: "https://example.com/game/audio/ru/clip.mp3",
    },
    respondWith: (p) => (pending = p),
  });
  assert.equal(await pending, response);
});


test("a transient shell download failure retries; permanent failure never activates", async () => {
  for (const failures of [1, Infinity]) {
    const handlers = {};
    let attempts = 0, activated = false, pending;
    vm.runInNewContext(readFileSync(new URL("../sw.js", import.meta.url), "utf8"), {
      URL, Request, Promise,
      self: {
        registration: {scope: "https://example.com/game/"},
        addEventListener: (name, fn) => handlers[name] = fn,
        skipWaiting: async () => {activated = true;},
      },
      caches: {open: async () => ({addAll: async () => {
        if (++attempts <= failures) throw new Error("HTTP 503");
      }})},
    });
    handlers.install({waitUntil: (promise) => {pending = promise;}});
    if (failures === Infinity) {
      await assert.rejects(pending, /503/);
      assert.equal(attempts, 3);
      assert.equal(activated, false);
    } else {
      await pending;
      assert.equal(attempts, 2);
      assert.equal(activated, true);
    }
  }
});
