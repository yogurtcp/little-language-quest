import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { audioManifest } from "../src/core/audio-manifest.js";
const read = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const lexicon = read("../scripts/hebrew/pronunciations.json");
const { records } = read("../scripts/hebrew/recordings.json");
test("every Hebrew clip uses the exact pointed pronunciation dictionary", () => {
  for (const [text, path] of Object.entries(audioManifest.he)) {
    const ipa = text
      .normalize("NFC")
      .replace(/[\u0590-\u05ff]+/gu, (token) => {
        assert.ok(lexicon[token], `Missing pointed token: ${token}`);
        return lexicon[token];
      })
      .replaceAll("\u0361", "");
    assert.equal(records[text].ipa, ipa, text);
    assert.equal(records[text].path, path);
  }
  assert.equal(lexicon["שְׁמוֹנֶה".normalize("NFC")], "ʃmˈone");
  assert.equal(lexicon["שְׁמוֹנָה".normalize("NFC")], "ʃmonˈa");
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
