import { concepts, alphabets, word } from "./content.js";
import { t } from "./i18n.js";
import { clues } from "./clues.js";
import { speech as chinese, initialPrompt } from "../locales/zh.js";
import { speech as japanese, quantity as japaneseQuantity } from "../locales/ja.js";
export const spoken = {
  zh: chinese,
  ja: japanese,
  ru: {
    numbers: [
      "ноль",
      "один",
      "два",
      "три",
      "четыре",
      "пять",
      "шесть",
      "семь",
      "восемь",
      "девять",
      "десять",
    ],
    plus: "плюс",
    minus: "минус",
    and: "и",
    answer: "Сколько получится?",
    first: "Какая первая буква в этом слове?",
    letters: [
      "а",
      "бэ",
      "вэ",
      "гэ",
      "дэ",
      "е",
      "ё",
      "жэ",
      "зэ",
      "и",
      "и краткое",
      "ка",
      "эль",
      "эм",
      "эн",
      "о",
      "пэ",
      "эр",
      "эс",
      "тэ",
      "у",
      "эф",
      "ха",
      "цэ",
      "чэ",
      "ша",
      "ща",
      "твёрдый знак",
      "ы",
      "мягкий знак",
      "э",
      "ю",
      "я",
    ],
  },
  he: {
    numbers: [
      "אֶפֶס",
      "אַחַת",
      "שְׁתַּיִם",
      "שָׁלוֹשׁ",
      "אַרְבַּע",
      "חָמֵשׁ",
      "שֵׁשׁ",
      "שֶׁבַע",
      "שְׁמוֹנֶה",
      "תֵּשַׁע",
      "עֶשֶׂר",
    ],
    plus: "וְעוֹד",
    minus: "פָּחוֹת",
    and: "וְגַם",
    answer: "כַּמָּה זֶה?",
    first: "מָה הָאוֹת הָרִאשׁוֹנָה בַּמִּלָּה הַזֹּאת?",
    letters: [
      "אָלֶף",
      "בֵּית",
      "גִּימֶל",
      "דָּלֶת",
      "הֵא",
      "וָו",
      "זַיִן",
      "חֵית",
      "טֵית",
      "יוֹד",
      "כָּף",
      "לָמֶד",
      "מֵם",
      "נוּן",
      "סָמֶךְ",
      "עַיִן",
      "פֵּא",
      "צָדִי",
      "קוֹף",
      "רֵישׁ",
      "שִׁין",
      "תָּו",
    ],
  },
  en: {
    numbers: [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
    ],
    plus: "plus",
    minus: "minus",
    and: "and",
    answer: "What is the answer?",
    first: "What is the first letter of this word?",
    letters: [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
  },
};
export const initialSpeech = (locale, letter) =>
  locale === "zh" ? initialPrompt(letter) : t(
    locale,
    "initialSet",
    spoken[locale].letters[alphabets[locale].indexOf(letter)],
  );
export const firstSpeech = (locale, item) => [
  spoken[locale].first,
  word(item, locale).speech,
];
export const mathSpeech = (locale, a, b, plus) => [
  spoken[locale].numbers[a],
  spoken[locale][plus ? "plus" : "minus"],
  spoken[locale].numbers[b],
  spoken[locale].answer,
];
export const comparisonSpeech = (locale, a, b) => [
  spoken[locale].numbers[a],
  spoken[locale].and,
  spoken[locale].numbers[b],
  t(locale, "compare"),
];
// Speak complete, inflected noun phrases. Digits leave grammatical gender
// and case up to the synthesizer (e.g. it can read "2 звезды" as "два звезды").
const russianQuantities = {
  countGroup: [
    null,
    "один кружок",
    "два кружка",
    "три кружка",
    "четыре кружка",
    "пять кружков",
    "шесть кружков",
    "семь кружков",
    "восемь кружков",
    "девять кружков",
    "десять кружков",
  ],
  makeAmount: [
    null,
    "одну звезду",
    "две звезды",
    "три звезды",
    "четыре звезды",
    "пять звёзд",
    "шесть звёзд",
    "семь звёзд",
    "восемь звёзд",
    "девять звёзд",
    "десять звёзд",
  ],
};
export function quantitySpeech(locale, kind, n) {
  if (locale === "ja") return japaneseQuantity(kind, n);
  if (locale === "zh") return t(locale, kind, n === 2 ? "两" : chinese.numbers[n]);
  if (locale !== "ru") return t(locale, kind, n);
  const phrase = russianQuantities[kind]?.[n];
  if (!phrase)
    throw new RangeError(`Unsupported Russian quantity: ${kind}/${n}`);
  return kind === "countGroup"
    ? `Где ${phrase}?`
    : `Сделай ${phrase}. Нажимай на плюс или минус.`;
}
export function speechCatalog(locale) {
  const values = [
    ...concepts.map((item) => word(item, locale).speech),
    ...clues.map((clue) => clue.prompts[locale]),
    ...alphabets[locale].map((letter) => initialSpeech(locale, letter)),
    ...Array.from({ length: 10 }, (_, i) =>
      quantitySpeech(locale, "countGroup", i + 1),
    ),
    ...Array.from({ length: 9 }, (_, i) =>
      quantitySpeech(locale, "makeAmount", i + 2),
    ),
    ...[
      "memoryPairs",
      "letterOrder",
      "listenChoose",
      "missingNumber",
      "patternNext",
      "compare",
    ].map((key) => t(locale, key)),
    ...spoken[locale].numbers,
    spoken[locale].plus,
    spoken[locale].minus,
    spoken[locale].and,
    spoken[locale].answer,
    spoken[locale].first,
  ];
  return [...new Set(values)];
}
