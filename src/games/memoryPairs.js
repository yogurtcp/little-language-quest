import { concepts, word } from "../core/content.js";
import { shuffle, node, button, pick } from "../core/helpers.js";
import { art } from "../core/art.js";
import { t } from "../core/i18n.js";
import { grid, revealWord } from "./shared.js";
export const memoryPairs = {
  id: "memoryPairs",
  create({ locale, level, rng, choose = (_key, pool) => pick(pool, rng) }) {
    const selected = [];
    while (selected.length < (level === 1 ? 2 : level === 2 ? 3 : 4))
      selected.push(
        choose(
          "words",
          concepts.filter((item) => !selected.includes(item)),
        ),
      );
    const cards = shuffle(
      selected.flatMap((item) => [
        { id: item.id, kind: "art", item },
        { id: item.id, kind: "word", item },
      ]),
      rng,
    );
    return {
      key: selected.map((item) => item.id).join(","),
      cards: cards.map(({ id, kind }) => ({ id, kind })),
      prompt: t(locale, "memoryPairs"),
      render(host, api) {
        const area = grid(host, "memory-grid");
        let open = [],
          matched = new Set(),
          pendingMismatch = null;
        const elements = cards.map((card) => {
          const element = button("choice memory-card", "", () => {
            if (api.isComplete?.() || matched.has(card.id)) return;
            if (pendingMismatch) {
              const wasShowing = pendingMismatch.some(
                (entry) => entry.element === element,
              );
              hideMismatch(pendingMismatch);
              if (wasShowing) return;
            }
            if (open.some((entry) => entry.element === element)) {
              hide(element);
              open = [];
              return;
            }
            reveal(element, card);
            open.push({ card, element });
            api.audio.speak(word(card.item, locale).speech, locale);
            if (open.length === 2) {
              const [first, second] = open;
              if (
                first.card.id === second.card.id &&
                first.card.kind !== second.card.kind
              ) {
                matched.add(card.id);
                first.element.classList.add("matched");
                second.element.classList.add("matched");
                const artCard = first.card.kind === "art" ? first : second;
                revealWord(artCard.element, artCard.card.item, api);
                first.element.disabled = true;
                second.element.disabled = true;
                open = [];
                if (matched.size === selected.length) api.complete();
              } else {
                const pair = open;
                pendingMismatch = pair;
                api.wrong(null, false);
                api.later(() => hideMismatch(pair), 1100);
              }
            }
          });
          element.addEventListener("pointerdown", (event) => {
            // Keep the release on the pressed card even if a finger slides.
            if (event.isPrimary && event.button === 0)
              element.setPointerCapture?.(event.pointerId);
          });
          hide(element);
          return element;
        });
        elements.forEach((element) => area.append(element));
        function hide(element) {
          element.innerHTML = '<span class="card-back">?</span>';
          element.setAttribute("aria-label", "?");
          element.setAttribute("aria-pressed", "false");
          element.classList.remove("revealed");
        }
        function hideMismatch(pair) {
          // A timer from an earlier preview must not hide a newer selection.
          if (pendingMismatch !== pair) return;
          for (const { element } of pair) hide(element);
          open = [];
          pendingMismatch = null;
        }
        function reveal(element, card) {
          element.innerHTML =
            card.kind === "art"
              ? art(card.item.art, word(card.item, locale).display)
              : "";
          if (card.kind === "word")
            element.append(
              node("span", "memory-word", word(card.item, locale).display),
            );
          element.setAttribute("aria-label", word(card.item, locale).display);
          element.setAttribute("aria-pressed", "true");
          element.classList.add("revealed");
        }
      },
    };
  },
};
