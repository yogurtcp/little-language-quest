import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { audioManifest } from "../src/core/audio-manifest.js";
const read = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const lexicon = read("../scripts/hebrew/speech-text.json");
const contexts = read("../scripts/hebrew/context.json");
const { records, voice, rate } = read("../scripts/hebrew/recordings.json");
test("Hebrew recordings use the approved Hila voice and explicit unpointed speech spelling", () => {
  assert.equal(voice, "he-IL-HilaNeural");
  assert.equal(rate, "+0%");
  for (const [text, path] of Object.entries(audioManifest.he)) {
    const input = text.normalize("NFC").replace(/[\u0590-\u05ff]+/gu, (token) => {
      assert.ok(lexicon[token], `Missing speech spelling: ${token}`);
      return lexicon[token];
    });
    const context = contexts[text];
    assert.equal(records[text].input, context?.input ?? input, text);
    if (context) {
      assert.equal(context.extractLastWord, input);
      assert.equal(records[text].extractLastWord, input);
      assert.doesNotMatch(context.input, /[\u0591-\u05bd\u05bf-\u05c2\u05c4-\u05c7]/);
    }
    assert.doesNotMatch(input, /[\u0591-\u05bd\u05bf-\u05c2\u05c4-\u05c7]/);
    assert.equal(records[text].path, path);
  }
  assert.equal(lexicon["עִגּוּלִים".normalize("NFC")], "עיגולים");
  assert.equal(lexicon["יָרָק".normalize("NFC")], "ירק");
  assert.equal(lexicon["יָרֹק".normalize("NFC")], "ירוק");
  assert.equal(lexicon["בַּרְוָז".normalize("NFC")], "ברווז");
  assert.equal(lexicon["פִּינְגְּוִין".normalize("NFC")], "פינגווין");
  assert.equal(records["גֶּזֶר"].input, "הארנב אוכל גזר.");
  assert.equal(records["גֶּזֶר"].extractLastWord, "גזר");
});
test("legacy recording URLs contain the corrected audio", () => {
  const aliases = read("../scripts/audio-aliases.json");
  for (const [old, current] of Object.entries(aliases)) {
    assert.deepEqual(
      fs.readFileSync(new URL("../" + old, import.meta.url)),
      fs.readFileSync(new URL("../" + current, import.meta.url)),
      old,
    );
  }
});
