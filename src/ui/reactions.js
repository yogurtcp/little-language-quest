import { node } from "../core/helpers.js";
import { readSetting } from "../core/storage.js";

export const reactionStates = [
  "thinking", "happy", "sad", "surprised", "oops", "celebrating",
];
export const reactionsEnabled = () => readSetting("llq-reactions", "1") !== "0";
export const REACTION_FOCUS_MS = 2000;
export const REACTION_SETTLE_MS = 200;

// A reaction belongs to one screen. Its revision prevents an old reset timer
// from replacing a newer success or reward, even after several quick taps.
export function createReaction(initial = "thinking", { lifetime, preview = false } = {}) {
  const element = node("div", "reaction-portrait");
  element.setAttribute("aria-hidden", "true");
  const enabled = preview || reactionsEnabled();
  element.hidden = !enabled;
  element.style.setProperty("--reaction-focus-duration", `${REACTION_FOCUS_MS + REACTION_SETTLE_MS}ms`);
  const art = node("div", "reaction-art");
  const portrait = node("img", "reaction-image");
  portrait.alt = "";
  portrait.width = 384;
  portrait.height = 384;
  portrait.draggable = false;
  portrait.addEventListener("error", () => { element.hidden = true; });
  art.append(portrait);
  element.append(art);
  let revision = 0, shown = 0;
  function set(state, resetAfter = 0) {
    if (!enabled || !reactionStates.includes(state) || lifetime?.alive === false) return;
    const current = ++revision;
    element.dataset.reaction = state;
    const show = () => {
      if (current !== revision || shown === current || lifetime?.alive === false) return;
      shown = current;
      element.hidden = false;
      element.classList.remove("reaction-pop");
      void element.offsetWidth;
      element.classList.add("reaction-pop");
      if (resetAfter && lifetime)
        lifetime.later(() => {
          if (revision === current) set("thinking");
        }, Math.max(resetAfter, REACTION_FOCUS_MS + REACTION_SETTLE_MS));
    };
    // Start the full two-second hold when the image is actually available.
    portrait.onload = show;
    portrait.src = new URL(`../../assets/reactions/${state}.webp`, import.meta.url).href;
    if (portrait.complete && portrait.naturalWidth > 0) show();
  }
  set(initial);
  return { element, set };
}
