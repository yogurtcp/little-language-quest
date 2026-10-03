export const pick = (list, rng = Math.random) =>
  list[Math.floor(rng() * list.length)];
export function shuffle(list, rng = Math.random) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function sample(list, count, rng = Math.random) {
  return shuffle(list, rng).slice(0, count);
}
export function node(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== "") element.textContent = text;
  return element;
}
export function button(className, content, onClick) {
  const element = node("button", className);
  element.type = "button";
  if (typeof content === "string") element.textContent = content;
  else element.append(content);
  element.addEventListener("click", onClick);
  return element;
}
export function randomInt(min, max, rng = Math.random) {
  return min + Math.floor(rng() * (max - min + 1));
}
export function seeded(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
