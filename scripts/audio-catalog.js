import { speechCatalog } from "../src/core/speech.js";
console.log(
  JSON.stringify(
    Object.fromEntries(
      ["ru", "he", "en"].map((locale) => [locale, speechCatalog(locale)]),
    ),
  ),
);
