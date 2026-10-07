import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { pixelArtwork, pixelSheets } from "../src/core/pixel-art.js";
import { concepts } from "../src/core/content.js";

test("every vocabulary picture has a unique sprite and an offline asset", () => {
  assert.deepEqual(new Set(Object.keys(pixelArtwork)), new Set(concepts.map(({ id }) => id)));
  const positions = Object.values(pixelArtwork).map(({ sheet, column, row }) => `${sheet}/${column}/${row}`);
  assert.equal(new Set(positions).size, concepts.length);
  const sw = readFileSync(new URL("../sw.js", import.meta.url), "utf8");
  let bytes = 0;
  for (const sheet of Object.keys(pixelSheets)) {
    const path = `assets/objects/${sheet}.webp`;
    const size = statSync(new URL(`../${path}`, import.meta.url)).size;
    assert.ok(size > 1000, path);
    assert.ok(sw.includes(`./${path}`), `${path} must work offline`);
    bytes += size;
  }
  assert.ok(bytes < 1024 * 1024, `Object art should stay under 1 MiB; got ${bytes}`);
});
