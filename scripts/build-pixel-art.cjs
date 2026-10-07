// Build-only dependency: npm install --no-save sharp
// Usage: node scripts/build-pixel-art.cjs <sheet-name> <generated-atlas.png>
// Separates alpha-connected sprites, restores safe cell margins, and exports
// one compact atlas. No generated artwork is redrawn by this packing step.
const sharp = require("sharp");
const fs = require("node:fs/promises");
const path = require("node:path");

async function build() {
  const [name, source] = process.argv.slice(2);
  const { pixelSheets } = await import("../src/core/pixel-art.js");
  const ids = pixelSheets[name];
  if (!ids || !source) throw new Error("Expected a sheet name and generated PNG path");
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const labels = new Int32Array(width * height);
  const queue = new Int32Array(labels.length);
  const parts = [null];
  for (let start = 0; start < labels.length; start++) {
    if (labels[start] || data[start * 4 + 3] < 24) continue;
    const id = parts.length;
    const part = { area: 0, sumX: 0, sumY: 0, minX: width, minY: height, maxX: 0, maxY: 0 };
    let read = 0, write = 1;
    queue[0] = start; labels[start] = id;
    while (read < write) {
      const p = queue[read++], x = p % width, y = Math.floor(p / width);
      part.area++; part.sumX += x; part.sumY += y;
      part.minX = Math.min(part.minX, x); part.minY = Math.min(part.minY, y);
      part.maxX = Math.max(part.maxX, x); part.maxY = Math.max(part.maxY, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const next = ny * width + nx;
        if (labels[next] || data[next * 4 + 3] < 24) continue;
        labels[next] = id; queue[write++] = next;
      }
    }
    part.cell = Math.min(3, Math.floor(part.sumY / part.area / height * 4)) * 4 +
      Math.min(3, Math.floor(part.sumX / part.area / width * 4));
    parts.push(part);
  }
  const tiles = [];
  for (let cell = 0; cell < ids.length; cell++) {
    const group = parts.filter(p => p && p.cell === cell && p.area >= 9);
    if (!group.some(p => p.area > 200)) throw new Error(`Empty sprite: ${ids[cell]}`);
    const left = Math.min(...group.map(p => p.minX)), top = Math.min(...group.map(p => p.minY));
    const w = Math.max(...group.map(p => p.maxX)) - left + 1;
    const h = Math.max(...group.map(p => p.maxY)) - top + 1;
    const isolated = Buffer.alloc(w * h * 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const p = (top + y) * width + left + x, part = parts[labels[p]];
      if (part && part.cell === cell && part.area >= 9)
        data.copy(isolated, (y * w + x) * 4, p * 4, p * 4 + 4);
    }
    const small = await sharp(isolated, { raw: { width: w, height: h, channels: 4 } })
      .resize(88, 88, { fit: "contain", kernel: "nearest", background: "#00000000" })
      .extend({ top: 4, bottom: 4, left: 4, right: 4, background: "#00000000" })
      .png({ palette: true, colours: 64, dither: 0 }).toBuffer();
    const tile = await sharp(small).resize(192, 192, { kernel: "nearest" }).png().toBuffer();
    tiles.push({ input: tile, left: cell % 4 * 192, top: Math.floor(cell / 4) * 192 });
  }
  const out = path.join(__dirname, "../assets/objects", `${name}.webp`);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await sharp({ create: { width: 768, height: 768, channels: 4, background: "#00000000" } })
    .composite(tiles).webp({ lossless: true, effort: 6 }).toFile(out);
  console.log(`${name}: ${ids.length} sprites, ${(await fs.stat(out)).size} bytes`);
}
build().catch(error => { console.error(error); process.exitCode = 1; });
