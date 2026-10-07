import { pixelArtwork } from "./pixel-art.js";

// A clipped viewport selects one sprite from an atlas shared across all games.
export function art(id, label = "") {
  const sprite = pixelArtwork[id];
  if (!sprite) throw new Error(`Missing artwork: ${id}`);
  const { sheet, column, row } = sprite;
  const source = new URL(`../../assets/objects/${sheet}.webp`, import.meta.url).href;
  const safeLabel = String(label).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return `<svg class="art pixel-art" viewBox="0 0 1 1" role="img" aria-label="${safeLabel}"><svg x="0" y="0" width="1" height="1" overflow="hidden"><image href="${source}" x="${-column}" y="${-row}" width="4" height="4"/></svg></svg>`;
}

export function circles(count, color = "#78c7dc") {
  return `<svg class="count-art" viewBox="0 0 160 112" aria-hidden="true">${Array.from({ length: count }, (_, i) => `<circle cx="${28 + (i % 5) * 27}" cy="${28 + Math.floor(i / 5) * 43}" r="10" fill="${color}" stroke="#28324b" stroke-width="2"/>`).join("")}</svg>`;
}

export const artworkIds = Object.keys(pixelArtwork);
