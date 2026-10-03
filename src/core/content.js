// Each locale is curated independently. `initial` is the letter taught by the game.
const item = (id, ru, he, en, initials, facts = []) => ({
  id, art: id, facts,
  words: {
    ru: { display: ru, speech: ru, initial: initials[0] },
    he: { display: he, speech: he.replace(/[\u0591-\u05c7]/g, ''), initial: initials[1] },
    en: { display: en, speech: en, initial: initials[2] }
  }
});
export const concepts = [
  item('dog', 'собака', 'כֶּלֶב', 'dog', ['С','כ','D'], ['woof','animal']),
  item('cat', 'кот', 'חָתוּל', 'cat', ['К','ח','C'], ['meow','animal']),
  item('juice', 'сок', 'מִיץ', 'juice', ['С','מ','J'], ['drink']),
  item('sausage', 'сосиска', 'נַקְנִיקִיָּה', 'sausage', ['С','נ','S'], ['food']),
  item('sun', 'солнце', 'שֶׁמֶשׁ', 'sun', ['С','ש','S'], ['sky']),
  item('house', 'дом', 'בַּיִת', 'house', ['Д','ב','H'], ['building']),
  item('banana', 'банан', 'בָּנָנָה', 'banana', ['Б','ב','B'], ['fruit']),
  item('balloon', 'шарик', 'בַּלּוֹן', 'balloon', ['Ш','ב','B'], ['toy']),
  item('milk', 'молоко', 'חָלָב', 'milk', ['М','ח','M'], ['drink']),
  item('window', 'окно', 'חַלּוֹן', 'window', ['О','ח','W'], ['building']),
  item('clock', 'часы', 'שָׁעוֹן', 'clock', ['Ч','ש','C'], ['time']),
  item('chocolate', 'шоколад', 'שׁוֹקוֹלָד', 'chocolate', ['Ш','ש','C'], ['sweet']),
  item('cow', 'корова', 'פָּרָה', 'cow', ['К','פ','C'], ['moo','animal']),
  item('book', 'книга', 'סֵפֶר', 'book', ['К','ס','B'], ['reading']),
  item('candy', 'конфета', 'מַמְתָּק', 'candy', ['К','מ','C'], ['sweet']),
  item('cake', 'торт', 'עוּגָה', 'cake', ['Т','ע','C'], ['sweet']),
  item('car', 'машина', 'מְכוֹנִית', 'car', ['М','מ','C'], ['vehicle']),
  item('duck', 'утка', 'בַּרְוָז', 'duck', ['У','ב','D'], ['quack','animal']),
  item('apple', 'яблоко', 'תַּפּוּחַ', 'apple', ['Я','ת','A'], ['red','fruit']),
  item('fish', 'рыба', 'דָּג', 'fish', ['Р','ד','F'], ['animal','water']),
  item('tree', 'дерево', 'עֵץ', 'tree', ['Д','ע','T'], ['plant']),
  item('flower', 'цветок', 'פֶּרַח', 'flower', ['Ц','פ','F'], ['plant']),
  item('ball', 'мяч', 'כַּדּוּר', 'ball', ['М','כ','B'], ['toy']),
  item('star', 'звезда', 'כּוֹכָב', 'star', ['З','כ','S'], ['sky']),
  item('shoe', 'ботинок', 'נַעַל', 'shoe', ['Б','נ','S'], ['clothing'])
];
export const byId = Object.fromEntries(concepts.map(concept => [concept.id, concept]));
export const alphabets = {
  ru: [...'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'],
  he: [...'אבגדהוזחטיכלמנסעפצקרשת'],
  en: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
};
export const earlyLetters = {
  ru: ['А','Б','В','Д','К','М','О','С','Т'],
  he: ['א','ב','ג','ד','ה','ו','ח','כ','מ','ש'],
  en: ['A','B','C','D','E','F','H','M','S']
};
export const earlyRuns = {
  ru: [['А','Б','В'],['К','Л','М'],['С','Т','У']],
  he: [['א','ב','ג'],['ד','ה','ו'],['ז','ח','ט']],
  en: [['A','B','C'],['D','E','F'],['G','H','I']]
};
export function word(concept, locale) { return concept.words[locale]; }
export function groups(locale) {
  const result = new Map();
  for (const concept of concepts) {
    const initial = word(concept, locale).initial;
    result.set(initial, [...(result.get(initial) || []), concept]);
  }
  return [...result].filter(([, items]) => items.length >= 3);
}
