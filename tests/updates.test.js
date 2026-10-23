import test from "node:test";
import assert from "node:assert/strict";
import { watchUpdates } from "../src/core/updates.js";

function fixture({ controlled = true, online = true, ready = "complete", safe = true, fail = false } = {}) {
  const workerEvents = new Map(), windowEvents = new Map();
  let registrations = 0, checks = 0, reloads = 0, state;
  const workers = {
    controller: controlled ? {} : null,
    addEventListener: (name, fn) => workerEvents.set(name, fn),
    async register(url, options) {
      registrations++;
      assert.equal(url, "./sw.js");
      assert.equal(options.updateViaCache, "none");
      if (fail) throw new Error("offline");
      return { update: async () => { checks++; } };
    },
  };
  const updater = watchUpdates({
    canReload: () => safe,
    beforeReload: (value) => { state = value; },
    environment: {
      navigator: { onLine: online, serviceWorker: workers },
      document: { readyState: ready },
      window: { addEventListener: (name, fn, options) => windowEvents.set(name, { fn, options }) },
      location: { reload: () => { reloads++; } },
    },
  });
  return {
    updater, workers, windowEvents,
    change() { workerEvents.get("controllerchange")(); },
    get registrations() { return registrations; },
    get checks() { return checks; },
    get reloads() { return reloads; },
    get state() { return state; },
  };
}
const settle = () => new Promise((resolve) => setImmediate(resolve));

test("online startup checks once, even if load already fired; no foreground, reconnect, or timer checks", async () => {
  const loaded = fixture();
  await settle();
  assert.equal(loaded.registrations, 1);
  assert.equal(loaded.checks, 1);
  assert.equal(loaded.windowEvents.size, 0);
  const loading = fixture({ ready: "loading" });
  assert.equal(loading.registrations, 0);
  assert.deepEqual([...loading.windowEvents.keys()], ["load"]);
  assert.deepEqual(loading.windowEvents.get("load").options, { once: true });
  await loading.windowEvents.get("load").fn();
  assert.equal(loading.checks, 1);
});
test("offline startup uses the installed shell without update requests", async () => {
  const f = fixture({ online: false });
  await settle();
  assert.equal(f.registrations, 0);
  assert.equal(f.checks, 0);
});
test("updates leave the active question intact until a navigation boundary and reload once", async () => {
  const f = fixture({ safe: false });
  f.change();
  assert.equal(f.reloads, 0);
  assert.equal(f.updater.applyPending(), false);
  const state = { locale: "es", playing: true };
  assert.equal(f.updater.applyPending({ safe: true, state }), true);
  assert.deepEqual(f.state, state);
  assert.equal(f.reloads, 1);
  f.change();
  f.updater.applyPending({ safe: true });
  assert.equal(f.reloads, 1);
});
test("a new controller reloads an idle existing installation; the first install never reloads", () => {
  const old = fixture();
  old.change();
  assert.equal(old.reloads, 1);
  const fresh = fixture({ controlled: false });
  fresh.workers.controller = {};
  fresh.change();
  assert.equal(fresh.reloads, 0);
});
test("a failed startup update keeps the cached game running", async () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    const f = fixture({ fail: true });
    await settle();
    assert.equal(f.registrations, 1);
    assert.equal(f.reloads, 0);
    assert.equal(f.updater.applyPending(), false);
  } finally { console.warn = warn; }
});
