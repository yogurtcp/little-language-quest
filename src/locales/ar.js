// Modern Standard Arabic. Display words retain vowel marks for beginning readers.
export const vocabulary = {
  dog: "كَلْب", cat: "قِطّ", juice: "عَصِير", sausage: "نَقَانِق", sun: "شَمْس", house: "بَيْت",
  banana: "مَوْز", balloon: "بَالُون", milk: "حَلِيب", window: "نَافِذَة", clock: "سَاعَة", chocolate: "شُوكُولَاتَة",
  cow: "بَقَرَة", book: "كِتَاب", candy: "حَلْوَى", cake: "كَعْكَة", car: "سَيَّارَة", duck: "بَطَّة",
  apple: "تُفَّاحَة", fish: "سَمَكَة", tree: "شَجَرَة", flower: "زَهْرَة", ball: "كُرَة", star: "نَجْمَة", shoe: "حِذَاء",
  rabbit: "أَرْنَب", bear: "دُبّ", lion: "أَسَد", elephant: "فِيل", giraffe: "زَرَافَة", monkey: "قِرْد",
  horse: "حِصَان", sheep: "خَرُوف", pig: "خِنْزِير", mouse: "فَأْر", frog: "ضِفْدَع", turtle: "سُلَحْفَاة",
  butterfly: "فَرَاشَة", bee: "نَحْلَة", snail: "حَلَزُون", bird: "عُصْفُور", rooster: "دِيك", penguin: "بِطْرِيق",
  pear: "كُمَّثْرَى", orange: "بُرْتُقَالَة", lemon: "لَيْمُون", strawberry: "فَرَاوِلَة", grapes: "عِنَب", watermelon: "بِطِّيخ",
  carrot: "جَزَر", tomato: "طَمَاطِم", cucumber: "خِيَار", bread: "خُبْز", cheese: "جُبْن", egg: "بَيْضَة",
  icecream: "مُثَلَّجَات", pizza: "بِيتْزَا", bus: "حَافِلَة", train: "قِطَار", plane: "طَائِرَة", boat: "قَارِب",
  bicycle: "دَرَّاجَة", rocket: "صَارُوخ", umbrella: "مِظَلَّة", key: "مِفْتَاح", chair: "كُرْسِيّ", bed: "سَرِير",
  cup: "فِنْجَان", spoon: "مِلْعَقَة", brush: "فُرْشَاة أَسْنَان", pencil: "قَلَم", scissors: "مِقَصّ", hat: "قُبَّعَة",
  shirt: "قَمِيص", sock: "جَوْرَب", mitten: "قُفَّاز", drum: "طَبْل", guitar: "قِيثَارَة", kite: "طَائِرَة وَرَقِيَّة",
  moon: "قَمَر", cloud: "سَحَابَة", rainbow: "قَوْس قُزَح", snowman: "رَجُل الثَّلْج", leaf: "وَرَقَة", mushroom: "فِطْر", shell: "صَدَفَة",
};
// Teach the base alif for hamza-bearing opening forms; remove vowel marks only for literacy matching.
export const initial = (text) => [...text.normalize("NFD").replace(/\p{M}/gu, "")][0];
export const alphabet = [..."ابتثجحخدذرزسشصضطظعغفقكلمنهوي"];
export const early = [..."ابتجحخدسفكم"];
export const rows = Array.from({ length: 8 }, (_, i) => alphabet.slice(i * 3, i * 3 + 3));
export const clueText = {
  woof: "أي حيوان ينبح؟", meow: "أي حيوان يموء؟", moo: "أي حيوان يخور؟", quack: "أي حيوان يبطبط؟",
  baa: "أي حيوان يثغو؟", rooster: "أي حيوان يصيح في الصباح؟", oink: "أي حيوان يخنخر؟", neigh: "أي حيوان يصهل؟",
  trunk: "أي حيوان له خرطوم طويل؟", neck: "أي حيوان له عنق طويل جدا؟", mane: "أي حيوان له شعر كثيف حول وجهه؟",
  ears: "أي حيوان له أذنان طويلتان؟", shell: "أي حيوان يحمل درعا صلبا على ظهره؟", snail: "أي حيوان يزحف ببطء ويحمل بيتا صغيرا على ظهره؟",
  butterfly: "أي حيوان يطير بأجنحة ملونة؟", honey: "أي حيوان يصنع العسل؟", water: "أي حيوان يعيش تحت الماء؟",
  sweet: "ما الشيء الحلو؟", sour: "ما الشيء الذي طعمه حامض؟", red: "ما الشيء الأحمر في الصورة؟", yellow: "ما الشيء الأصفر في الصورة؟", green: "ما الشيء الأخضر في الصورة؟",
  fruit: "أي من هذه الأشياء فاكهة؟", drink: "ماذا يمكننا أن نشرب؟", cold: "ما الشيء البارد الذي يذوب؟", carrot: "أي نوع من الخضار يحبه الأرنب؟",
  read: "ماذا يمكننا أن نقرأ؟", time: "ما الشيء الذي يخبرنا بالوقت؟", rain: "ما الشيء الذي يحمينا من المطر؟", unlock: "بماذا نفتح القفل؟",
  sleep: "أين ننام؟", sit: "على ماذا نجلس؟", soup: "بماذا نأكل الحساء؟", teeth: "بماذا ننظف أسناننا؟",
  draw: "بماذا نرسم على الورق؟", cut: "بماذا نقص الورق؟", head: "ماذا نلبس على الرأس؟", hands: "ما الشيء الذي يدفئ اليدين؟",
  feet: "ماذا نلبس في القدمين؟", rails: "ما الشيء الذي يسير على السكة الحديدية؟", fly: "بماذا نسافر في السماء؟", sail: "بماذا نسافر على الماء؟",
  pedals: "ما الشيء الذي له عجلتان ودواستان؟", space: "ما الشيء الذي يمكنه الطيران إلى الفضاء؟", kick: "ماذا يمكننا أن نركل ونحن نلعب؟",
  strings: "أي آلة موسيقية لها أوتار؟", beat: "على ماذا نضرب بالعصي لنعزف الموسيقى؟", snow: "ماذا نصنع من الثلج؟",
  rainbow: "ما الشيء الملون الذي يظهر في السماء بعد المطر؟", sun: "ما الشيء الذي يضيء ويدفئنا في النهار؟",
};
const circles = [null, "دائرة واحدة", "دائرتان", "ثلاث دوائر", "أربع دوائر", "خمس دوائر", "ست دوائر", "سبع دوائر", "ثماني دوائر", "تسع دوائر", "عشر دوائر"];
const stars = [null, "نجمة واحدة", "نجمتين", "ثلاث نجمات", "أربع نجمات", "خمس نجمات", "ست نجمات", "سبع نجمات", "ثماني نجمات", "تسع نجمات", "عشر نجمات"];
export const quantity = (kind, n) => kind === "countGroup" ? `أين توجد ${circles[n]}؟` : `اصنع ${stars[n]}. اضغط على زائد أو ناقص.`;
export const ui = {
  update: "تحديث اللعبة", appName: "كلمات وأعداد", auto: "تلقائي", seed: "رقم السؤال",
  gameNames: { initialSet: "صور تبدأ بحرف", countGroup: "عد الدوائر", memoryPairs: "ابحث عن الأزواج", letterOrder: "رتب الحروف", firstLetter: "الحرف الأول", describe: "خمن من الوصف", arithmetic: "الجمع والطرح", compare: "قارن الأعداد", listenChoose: "استمع واختر", missingNumber: "العدد الناقص", makeAmount: "اصنع العدد", patternNext: "أكمل النمط" },
  patternNames: { circle: "دائرة", square: "مربع", triangle: "مثلث", diamond: "معين", coral: "وردي", teal: "فيروزي", gold: "أصفر", purple: "بنفسجي" },
  play: "العب", next: "التالي", again: "مرة أخرى", try: "حاول مرة أخرى!", good: "أحسنت!", star: "نجمة جديدة!", party: "احتفال النجوم!",
  speaker: "استمع مرة أخرى", parent: "للكبار", back: "رجوع", menu: "القائمة", choose: "اختر اللغة", parentQuestion: "كم يساوي 12 + 7؟", parentWrong: "حاول مرة أخرى", parentTitle: "قائمة الكبار",
  install: "تثبيت التطبيق", installHelp: "افتح قائمة المتصفح واختر إضافة إلى الشاشة الرئيسية أو تثبيت التطبيق.", installDone: "التطبيق مثبت بالفعل.",
  debug: "تجربة الألعاب", debugHint: "أسئلة التجربة لا تمنح نجوما.", voice: "الصوت", voiceReady: "صوت عربي مسجل", voiceMissing: "لا يوجد صوت عربي على هذا الجهاز. أضفه من إعدادات الجهاز.", voiceTest: "تجربة الصوت",
  mute: "الصوت", volume: "مستوى الصوت", difficulty: "الصعوبة", reset: "تصفير التقدم", resetAsk: "هل تريد مسح كل النجوم والتقدم؟", level: ["سهل", "متوسط", "أصعب"],
  initialSet: (letter) => `اضغط على كل الصور التي تبدأ أسماؤها بحرف ${letter}.`, countGroup: (n) => quantity("countGroup", n),
  memoryPairs: "ابحث عن كل كلمة وصورتها.", letterOrder: "اضغط على الحروف بالترتيب الهجائي.", firstLetter: (name) => `ما الحرف الأول في كلمة ${name}؟`, firstLetterPicture: "ما الحرف الأول في اسم الصورة؟",
  arithmetic: "حل المسألة.", compare: "ما العلامة المناسبة؟", arithmeticSpeech: (a, b, plus) => `${a} ${plus ? "زائد" : "ناقص"} ${b}. كم الناتج؟`, compareSpeech: (a, b) => `${a} و ${b}. ما العلامة المناسبة؟`,
  listenChoose: "استمع واختر الصورة.", missingNumber: "ما العدد الناقص؟", makeAmount: (n) => quantity("makeAmount", n), patternNext: "ماذا يأتي بعد ذلك؟",
  facts: { woof: clueText.woof, meow: clueText.meow, moo: clueText.moo, quack: clueText.quack, red: clueText.red, sweet: clueText.sweet },
  reactions: "صديق الصور", reactionPreview: "عرض التعابير", artPreview: "كل الصور", reactionNames: { thinking: "يفكر", happy: "رائع!", sad: "لنحاول مجددا", surprised: "واو!", oops: "أوه!", celebrating: "يحتفل!" },
  audioLoading: "جار تجهيز الصوت…", audioSpeaking: "استمع…", audioError: "اضغط على استمع مرة أخرى. تحقق من الاتصال والصوت.", audioMuted: "الصوت مغلق",
  progress: (n) => `${n} من 5 للحصول على نجمة`, offline: "تنزيل الصوت العربي للعب دون إنترنت", offlineBusy: "جار التنزيل…", offlineReady: "تم حفظ الصوت للعب دون إنترنت", offlineError: "لم يكتمل التنزيل. تحقق من الاتصال وحاول مجددا.",
  memoryHint: "اقلب بطاقتين. طابق الكلمة مع صورتها.", parentHint: "حل المسألة لفتح الإعدادات.",
};
export const speech = {
  numbers: ["صفر", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة"],
  plus: "زائد", minus: "ناقص", and: "و", answer: "كم الناتج؟", first: "ما الحرف الأول في هذه الكلمة؟",
  letters: ["ألف", "باء", "تاء", "ثاء", "جيم", "حاء", "خاء", "دال", "ذال", "راء", "زاي", "سين", "شين", "صاد", "ضاد", "طاء", "ظاء", "عين", "غين", "فاء", "قاف", "كاف", "لام", "ميم", "نون", "هاء", "واو", "ياء"],
};
