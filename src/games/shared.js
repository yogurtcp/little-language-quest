import { node, button } from "../core/helpers.js";
import { word } from "../core/content.js";
import { art, circles } from "../core/art.js";
export function grid(host, className = "") {
  const element = node("div", `choices ${className}`);
  host.append(element);
  return element;
}
export function picture(item, locale, onClick, showWord = false) {
  const element = button("choice picture-choice", "", onClick);
  element.innerHTML = art(item.art, word(item, locale).display);
  if (showWord) appendWord(element, item, locale);
  element.setAttribute("aria-label", word(item, locale).display);
  return element;
}
export function appendWord(element, item, locale, className = "picture-word") {
  const entry = word(item, locale);
  element.append(node("span", className, entry.display));
  if (entry.reading) element.append(node("span", "word-reading", entry.reading));
}
export function tile(label, onClick, extraClass = "") {
  const element = button(`choice tile-choice notranslate ${extraClass}`, label, onClick);
  element.setAttribute("translate", "no");
  return element;
}
export function group(count, onClick) {
  const element = button("choice count-choice", "", onClick);
  element.innerHTML = circles(count);
  element.setAttribute("aria-label", `${count}`);
  return element;
}
export function equation(host, text) {
  const element = node("div", "equation", text);
  element.dir = "ltr";
  host.append(element);
  return element;
}
export function numberChoices(host, options, answer, api) {
  const area = grid(host, "number-choices");
  options.forEach((value) => {
    const element = tile(String(value), () => {
      if (api.isComplete?.()) return;
      if (value !== answer) return api.wrong(element);
      element.classList.add("selected");
      api.complete();
    });
    area.append(element);
  });
  return area;
}

export function revealWord(element, item, api) {
  api.encourage?.();
  if (!element.querySelector(".picture-word"))
    appendWord(element, item, api.locale);
  element.classList.add("selected");
  api.audio.speak(word(item, api.locale).speech, api.locale);
}

// Incorrect picture taps teach the word too, without revealing its spelling.
export function wrongPicture(element, item, api) {
  api.wrong(element);
  api.audio.speak(word(item, api.locale).speech, api.locale);
}
