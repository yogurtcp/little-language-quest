import { readSetting, writeSetting } from "./storage.js";
import { languages } from "./i18n.js";
const KEY = "little-language-quest-progress-v1";
const blank = () => ({
  correct: 0,
  celebrations: 0,
  byLocale: Object.fromEntries(languages.map(({ code }) => [code, 0])),
  skills: {},
});
const count = (value) =>
  Number.isSafeInteger(value) && value >= 0 ? value : 0;
export function readProgress() {
  try {
    const value = JSON.parse(readSetting(KEY));
    if (!value || typeof value !== "object") return blank();
    return {
      correct: count(value.correct),
      celebrations: count(value.celebrations),
      byLocale: Object.fromEntries(
        languages.map(({ code: locale }) => [
          locale,
          count(value.byLocale?.[locale]),
        ]),
      ),
      skills: Object.fromEntries(
        Object.entries(value.skills || {}).map(([key, value]) => [
          key,
          count(value),
        ]),
      ),
    };
  } catch {
    return blank();
  }
}
export function saveProgress(progress) {
  return writeSetting(KEY, JSON.stringify(progress));
}
export function resetProgress() {
  const value = blank();
  saveProgress(value);
  return value;
}
export function award(progress, locale, gameId = "", misses = 0) {
  const next = {
    ...progress,
    byLocale: { ...progress.byLocale },
    skills: { ...progress.skills },
  };
  next.correct++;
  next.byLocale[locale] = (next.byLocale[locale] || 0) + 1;
  // Difficulty advances independently for a skill after repeated unassisted success.
  const key = `${locale}:${gameId}`;
  if (gameId && misses === 0) next.skills[key] = (next.skills[key] || 0) + 1;
  const star = next.correct % 5 === 0,
    celebrate = star && next.correct % 25 === 0;
  if (celebrate) next.celebrations++;
  saveProgress(next);
  return { progress: next, star, celebrate };
}
