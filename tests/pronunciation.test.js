import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { audioManifest } from "../src/core/audio-manifest.js";
const read = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const { records, voice, engine, speed } = read("../scripts/hebrew/blue-recordings.json");
test("Hebrew uses the approved free female BlueTTS recordings with complete provenance", () => {
  assert.equal(engine, "BlueTTS 2.5");
  assert.equal(voice, "libri_female_6147");
  assert.equal(speed, .8);
  for (const [text, path] of Object.entries(audioManifest.he)) {
    assert.equal(records[text].input, text.normalize("NFC"));
    assert.equal(records[text].path, path);
    assert.match(path, /^audio\/he\/blue-[a-f0-9]+\.mp3$/);
    assert.ok(records[text].ipa.trim());
    assert.doesNotMatch(records[text].ipa, /[\u0590-\u05ff]/);
    assert.ok(records[text].seconds > .15 && records[text].seconds < 20);
  }
});
test("legacy recording URLs remain valid for older installations", () => {
  const aliases = read("../scripts/audio-aliases.json");
  for (const [old, current] of Object.entries(aliases)) {
    assert.deepEqual(
      fs.readFileSync(new URL("../" + old, import.meta.url)),
      fs.readFileSync(new URL("../" + current, import.meta.url)),
      old,
    );
  }
});
