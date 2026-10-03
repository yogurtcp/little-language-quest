const KEY = 'little-language-quest-progress-v1';
const blank = () => ({ correct: 0, celebrations: 0, byLocale: { ru: 0, he: 0, en: 0 } });
export function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    if (!value || typeof value.correct !== 'number' || !value.byLocale) return blank();
    return value;
  } catch { return blank(); }
}
export function saveProgress(progress) { localStorage.setItem(KEY, JSON.stringify(progress)); }
export function resetProgress() { const value = blank(); saveProgress(value); return value; }
export function award(progress, locale) {
  const next = { ...progress, byLocale: { ...progress.byLocale } };
  next.correct += 1;
  next.byLocale[locale] = (next.byLocale[locale] || 0) + 1;
  const star = next.correct % 5 === 0;
  const celebrate = star && next.correct % 25 === 0;
  if (celebrate) next.celebrations += 1;
  saveProgress(next);
  return { progress: next, star, celebrate };
}
