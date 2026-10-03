import { node, button } from '../core/helpers.js';
import { word } from '../core/content.js';
import { art, circles } from '../core/art.js';
export function grid(host, className = '') {
  const element = node('div', `choices ${className}`);
  host.append(element);
  return element;
}
export function picture(item, locale, onClick, showWord = false) {
  const element = button('choice picture-choice', '', onClick);
  element.innerHTML = art(item.art, word(item,locale).display);
  if (showWord) element.append(node('span','picture-word',word(item,locale).display));
  element.setAttribute('aria-label', word(item,locale).display);
  return element;
}
export function tile(label, onClick, extraClass = '') {
  return button(`choice tile-choice ${extraClass}`, label, onClick);
}
export function group(count, onClick) {
  const element = button('choice count-choice', '', onClick);
  element.innerHTML = circles(count);
  element.setAttribute('aria-label', `${count}`);
  return element;
}
export function equation(host, text) {
  const element = node('div', 'equation', text);
  element.dir = 'ltr';
  host.append(element);
  return element;
}
export function numberChoices(host, options, answer, api) {
  const area = grid(host, 'number-choices');
  options.forEach(value => {
    const element = tile(String(value), () => value === answer ? api.complete() : api.wrong(element));
    area.append(element);
  });
  return area;
}
