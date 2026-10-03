const ruNoun = (n, one, few, many) => n % 10 === 1 && n % 100 !== 11 ? one : [2,3,4].includes(n % 10) && !(n % 100 >= 12 && n % 100 <= 14) ? few : many;
const heCircle = n => n === 1 ? 'עִגּוּל אֶחָד' : n === 2 ? 'שְׁנֵי עִגּוּלִים' : `${['','','','שְׁלוֹשָׁה','אַרְבָּעָה','חֲמִשָּׁה','שִׁשָּׁה','שִׁבְעָה','שְׁמוֹנָה','תִּשְׁעָה','עֲשָׂרָה'][n]} עִגּוּלִים`;
export const languages = [
  { code: 'ru', name: 'Русский', tag: 'ru-RU', flag: 'АБВ' },
  { code: 'he', name: 'עִבְרִית', tag: 'he-IL', flag: 'אבג' },
  { code: 'en', name: 'English', tag: 'en-US', flag: 'ABC' }
];
export const copy = {
  ru: {
    appName: 'Игра слов и чисел', auto: 'Авто', seed: 'Номер задания',
    gameNames: { initialSet:'Картинки на букву', countGroup:'Посчитай кружки', memoryPairs:'Найди пары', letterOrder:'Буквы по порядку', firstLetter:'Первая буква', describe:'Угадай по описанию', arithmetic:'Сложение и вычитание', compare:'Сравни числа', listenChoose:'Слушай и выбирай', missingNumber:'Пропущенное число', makeAmount:'Сделай столько', patternNext:'Продолжи узор' },
    patternNames: {circle:'круг',square:'квадрат',triangle:'треугольник',diamond:'ромб',coral:'розовый',teal:'бирюзовый',gold:'жёлтый',purple:'фиолетовый'},
    play: 'Играть', next: 'Дальше', again: 'Ещё раз', try: 'Попробуй ещё!', good: 'Отлично!', star: 'Новая звезда!', party: 'Праздник звёзд!', speaker: 'Повторить задание', parent: 'Для взрослых', back: 'Назад', menu: 'Меню', choose: 'Выбери язык', parentQuestion: 'Сколько будет 12 + 7?', parentWrong: 'Попробуйте ещё раз', parentTitle: 'Меню для взрослых', install: 'Установить приложение', installHelp: 'Откройте меню браузера и выберите «Добавить на главный экран» или «Установить приложение».', debug: 'Проверка игр', debugHint: 'Проверочные задания не дают звёзды.', voice: 'Голос', voiceReady: 'Голос найден', voiceMissing: 'На этом устройстве нет русского голоса. Добавьте его в настройках устройства.', mute: 'Звук', difficulty: 'Сложность', reset: 'Сбросить прогресс', resetAsk: 'Сбросить все звёзды и задания?', level: ['Легко','Средне','Сложнее'],
    initialSet: letter => `Нажми на все картинки, названия которых начинаются с буквы ${letter}.`,
    countGroup: n => `Где ${n} ${ruNoun(n,'кружок','кружка','кружков')}?`,
    memoryPairs: 'Найди пары: слово и картинка.',
    letterOrder: 'Нажми на буквы по порядку.',
    firstLetter: name => `Какая первая буква в слове «${name}»?`,
    arithmetic: 'Реши пример.', compare: 'Какой знак подходит?',
    listenChoose: 'Послушай и выбери картинку.', missingNumber: 'Какого числа не хватает?',
    makeAmount: n => `Сделай ${n} ${ruNoun(n,'звезду','звезды','звёзд')}. Нажимай на плюс или минус.`,
    patternNext: 'Что идёт дальше?',
    facts: { woof:'Кто говорит «гав-гав»?', meow:'Кто говорит «мяу»?', moo:'Кто говорит «му»?', quack:'Кто говорит «кря-кря»?', red:'Что красное?', sweet:'Что сладкое?' }
  },
  he: {
    appName: 'מִשְׂחַק מִלִּים וּמִסְפָּרִים', auto: 'אוֹטוֹמָטִי', seed: 'מִסְפַּר מִשְׂחָק',
    gameNames: {initialSet:'תְּמוּנוֹת לְפִי אוֹת',countGroup:'סְפִירַת עִגּוּלִים',memoryPairs:'מִשְׂחַק זִכָּרוֹן',letterOrder:'סֵדֶר הָאוֹתִיּוֹת',firstLetter:'הָאוֹת הָרִאשׁוֹנָה',describe:'חִידוֹת תֵּאוּר',arithmetic:'חִבּוּר וְחִסּוּר',compare:'הַשְׁוָאַת מִסְפָּרִים',listenChoose:'הַקְשֵׁב וּבְחַר',missingNumber:'הַמִּסְפָּר הֶחָסֵר',makeAmount:'צֹר כַּמּוּת',patternNext:'הֶמְשֵׁךְ הַדְּגָם'},
    patternNames: {circle:'עִגּוּל',square:'רִבּוּעַ',triangle:'מְשֻׁלָּשׁ',diamond:'מְעוּיָן',coral:'וָרֹד',teal:'טוּרְקִיז',gold:'צָהֹב',purple:'סָגֹל'},
    play: 'שַׂחֵק', next: 'הַבָּא', again: 'עוֹד פַּעַם', try: 'נַסֵּה שׁוּב!', good: 'כָּל הַכָּבוֹד!', star: 'כּוֹכָב חָדָשׁ!', party: 'חֲגִיגַת כּוֹכָבִים!', speaker: 'שְׁמַע שׁוּב', parent: 'לַהוֹרִים', back: 'חֲזָרָה', menu: 'תַּפְרִיט', choose: 'בְּחַר שָׂפָה', parentQuestion: 'כַּמָּה זֶה 12 + 7?', parentWrong: 'נַסּוּ שׁוּב', parentTitle: 'תַּפְרִיט הוֹרִים', install: 'הַתְקֵן אֶת הָאֲפְלִיקַצְיָה', installHelp: 'פִּתְחוּ אֶת תַּפְרִיט הַדַּפְדְּפָן וּבְחֲרוּ ״הוֹסָפָה לְמָסָךְ הַבַּיִת״.', debug: 'בְּדִיקַת מִשְׂחָקִים', debugHint: 'מִשְׂחֲקֵי בְּדִיקָה לֹא מוֹסִיפִים כּוֹכָבִים.', voice: 'קוֹל', voiceReady: 'נִמְצָא קוֹל עִבְרִי', voiceMissing: 'לֹא נִמְצָא קוֹל עִבְרִי בַּמַּכְשִׁיר. הוֹסִיפוּ קוֹל בְּהַגְדָּרוֹת הַמַּכְשִׁיר.', mute: 'קוֹל', difficulty: 'רָמָה', reset: 'אִפּוּס הִתְקַדְּמוּת', resetAsk: 'לְאַפֵּס אֶת כָּל הַכּוֹכָבִים?', level: ['קַל','בֵּינוֹנִי','מִתְקַדֵּם'],
    initialSet: letter => `בְּחַר אֶת כָּל הַתְּמוּנוֹת שֶׁמַּתְחִילוֹת בָּאוֹת ${letter}.`,
    countGroup: n => `אֵיפֹה יֵשׁ ${heCircle(n)}?`,
    memoryPairs: 'מְצָא זוּגוֹת שֶׁל מִלָּה וּתְמוּנָה.',
    letterOrder: 'לְחַץ עַל הָאוֹתִיּוֹת לְפִי הַסֵּדֶר.',
    firstLetter: name => `מָה הָאוֹת הָרִאשׁוֹנָה בַּמִּלָּה ${name}?`,
    arithmetic: 'פְּתֹר אֶת הַתַּרְגִּיל.', compare: 'אֵיזֶה סִימָן מַתְאִים?',
    listenChoose: 'הַקְשֵׁב וּבְחַר תְּמוּנָה.', missingNumber: 'אֵיזֶה מִסְפָּר חָסֵר?',
    makeAmount: n => `צֹר ${n} כּוֹכָבִים. לְחַץ עַל פְּלוּס אוֹ מִינוּס.`,
    patternNext: 'מָה בָּא אַחַר כָּךְ?',
    facts: { woof:'מִי אוֹמֵר הַב הַב?', meow:'מִי אוֹמֵר מְיָאוּ?', moo:'מִי אוֹמֵר מוּ?', quack:'מִי אוֹמֵר גַּע גַּע?', red:'מָה אָדֹם?', sweet:'מָה מָּתוֹק?' }
  },
  en: {
    appName: 'Words & Numbers', auto: 'Auto', seed: 'Task number',
    gameNames: {initialSet:'Starts with a letter',countGroup:'Count the circles',memoryPairs:'Memory pairs',letterOrder:'Letters in order',firstLetter:'First letter',describe:'Clue cards',arithmetic:'Add and subtract',compare:'Compare numbers',listenChoose:'Listen and choose',missingNumber:'Missing number',makeAmount:'Make an amount',patternNext:'Continue the pattern'},
    patternNames: {circle:'circle',square:'square',triangle:'triangle',diamond:'diamond',coral:'pink',teal:'teal',gold:'yellow',purple:'purple'},
    play: 'Play', next: 'Next', again: 'Again', try: 'Try again!', good: 'Great job!', star: 'A new star!', party: 'Star celebration!', speaker: 'Hear it again', parent: 'For grown-ups', back: 'Back', menu: 'Menu', choose: 'Choose a language', parentQuestion: 'What is 12 + 7?', parentWrong: 'Try again', parentTitle: 'Grown-up menu', install: 'Install app', installHelp: 'Open your browser menu and choose “Add to Home Screen” or “Install app”.', debug: 'Game lab', debugHint: 'Practice tasks do not award stars.', voice: 'Voice', voiceReady: 'Voice available', voiceMissing: 'No English voice is installed on this device. Add one in device settings.', mute: 'Sound', difficulty: 'Difficulty', reset: 'Reset progress', resetAsk: 'Reset all stars and completed tasks?', level: ['Easy','Medium','Harder'],
    initialSet: letter => `Tap every picture that starts with the letter ${letter}.`,
    countGroup: n => `Where are ${n} circles?`,
    memoryPairs: 'Find the matching word and picture.',
    letterOrder: 'Tap the letters in order.',
    firstLetter: name => `What is the first letter of ${name}?`,
    arithmetic: 'Solve the math problem.', compare: 'Which sign fits?',
    listenChoose: 'Listen and choose the picture.', missingNumber: 'Which number is missing?',
    makeAmount: n => `Make ${n} stars. Tap plus or minus.`,
    patternNext: 'What comes next?',
    facts: { woof:'Who says woof?', meow:'Who says meow?', moo:'Who says moo?', quack:'Who says quack?', red:'What is red?', sweet:'What is sweet?' }
  }
};
export const t = (locale, key, ...args) => typeof copy[locale][key] === 'function' ? copy[locale][key](...args) : copy[locale][key];
