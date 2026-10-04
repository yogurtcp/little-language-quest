import { node } from "../core/helpers.js";
import { t } from "../core/i18n.js";

export function volumeControl(audio, locale, id, onCommit = () => {}) {
  const container = node("div", "volume-control");
  const label = node("label", "", t(locale, "volume"));
  const input = node("input", "volume-range");
  const value = node("output", "volume-value");
  input.id = id;
  input.type = "range";
  input.min = "0";
  input.max = "250";
  input.step = "10";
  label.htmlFor = id;
  value.htmlFor = id;
  function sync() {
    input.value = String(audio.muted ? 0 : audio.volume);
    value.textContent = `${audio.muted ? 0 : audio.volume}%`;
  }
  input.addEventListener("input", () => {
    audio.setVolume(input.value);
    sync();
  });
  input.addEventListener("change", () => {
    if (!audio.muted) onCommit();
  });
  container.append(label, input, value);
  sync();
  return { element: container, sync };
}
