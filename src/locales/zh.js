// Mandarin, Simplified Chinese. Pinyin is part of Chinese literacy, not English.
export const vocabulary = {
  dog: ["狗", "gǒu"], cat: ["猫", "māo"], juice: ["果汁", "guǒzhī"],
  sausage: ["香肠", "xiāngcháng"], sun: ["太阳", "tàiyáng"], house: ["房子", "fángzi"],
  banana: ["香蕉", "xiāngjiāo"], balloon: ["气球", "qìqiú"], milk: ["牛奶", "niúnǎi"],
  window: ["窗户", "chuānghu"], clock: ["时钟", "shízhōng"], chocolate: ["巧克力", "qiǎokèlì"],
  cow: ["奶牛", "nǎiniú"], book: ["书", "shū"], candy: ["糖果", "tángguǒ"],
  cake: ["蛋糕", "dàngāo"], car: ["汽车", "qìchē"], duck: ["鸭子", "yāzi"],
  apple: ["苹果", "píngguǒ"], fish: ["鱼", "yú"], tree: ["树", "shù"],
  flower: ["花", "huā"], ball: ["球", "qiú"], star: ["星星", "xīngxing"],
  shoe: ["鞋子", "xiézi"], rabbit: ["兔子", "tùzi"], bear: ["熊", "xióng"],
  lion: ["狮子", "shīzi"], elephant: ["大象", "dàxiàng"], giraffe: ["长颈鹿", "chángjǐnglù"],
  monkey: ["猴子", "hóuzi"], horse: ["马", "mǎ"], sheep: ["绵羊", "miányáng"],
  pig: ["猪", "zhū"], mouse: ["老鼠", "lǎoshǔ"], frog: ["青蛙", "qīngwā"],
  turtle: ["乌龟", "wūguī"], butterfly: ["蝴蝶", "húdié"], bee: ["蜜蜂", "mìfēng"],
  snail: ["蜗牛", "wōniú"], bird: ["小鸟", "xiǎoniǎo"], rooster: ["公鸡", "gōngjī"],
  penguin: ["企鹅", "qǐ'é"], pear: ["梨", "lí"], orange: ["橙子", "chéngzi"],
  lemon: ["柠檬", "níngméng"], strawberry: ["草莓", "cǎoméi"], grapes: ["葡萄", "pútao"],
  watermelon: ["西瓜", "xīguā"], carrot: ["胡萝卜", "húluóbo"], tomato: ["西红柿", "xīhóngshì"],
  cucumber: ["黄瓜", "huángguā"], bread: ["面包", "miànbāo"], cheese: ["奶酪", "nǎilào"],
  egg: ["鸡蛋", "jīdàn"], icecream: ["冰淇淋", "bīngqílín"], pizza: ["比萨", "bǐsà"],
  bus: ["公共汽车", "gōnggòng qìchē"], train: ["火车", "huǒchē"], plane: ["飞机", "fēijī"],
  boat: ["小船", "xiǎochuán"], bicycle: ["自行车", "zìxíngchē"], rocket: ["火箭", "huǒjiàn"],
  umbrella: ["雨伞", "yǔsǎn"], key: ["钥匙", "yàoshi"], chair: ["椅子", "yǐzi"],
  bed: ["床", "chuáng"], cup: ["杯子", "bēizi"], spoon: ["勺子", "sháozi"],
  brush: ["牙刷", "yáshuā"], pencil: ["铅笔", "qiānbǐ"], scissors: ["剪刀", "jiǎndāo"],
  hat: ["帽子", "màozi"], shirt: ["衬衫", "chènshān"], sock: ["袜子", "wàzi"],
  mitten: ["手套", "shǒutào"], drum: ["鼓", "gǔ"], guitar: ["吉他", "jítā"],
  kite: ["风筝", "fēngzheng"], moon: ["月亮", "yuèliang"], cloud: ["云", "yún"],
  rainbow: ["彩虹", "cǎihóng"], snowman: ["雪人", "xuěrén"], leaf: ["树叶", "shùyè"],
  mushroom: ["蘑菇", "mógu"], shell: ["贝壳", "bèiké"],
};
// Keep zh/ch/sh as whole pinyin units. Ordering stays within familiar teaching rows.
export const rows = [
  ["b", "p", "m", "f"], ["d", "t", "n", "l"], ["g", "k", "h"],
  ["j", "q", "x"], ["zh", "ch", "sh", "r"], ["z", "c", "s"],
];
export const alphabet = [...rows.flat(), "y", "w", "a", "o", "e"];
export const early = ["b", "p", "m", "f", "d", "t", "n", "l", "g", "h"];
// Familiar Mandarin syllables cue the opening sound without English letter names.
export const soundExamples = {
  b: "包", p: "跑", m: "猫", f: "飞", d: "大", t: "兔", n: "牛", l: "梨",
  g: "狗", k: "口", h: "花", j: "鸡", q: "球", x: "西", zh: "猪", ch: "车",
  sh: "书", r: "日", z: "字", c: "草", s: "三", y: "鱼", w: "乌", a: "啊", o: "哦", e: "鹅",
};
export const clueText = {
  woof: "谁会汪汪叫？", meow: "谁会喵喵叫？", moo: "谁会哞哞叫？", quack: "谁会嘎嘎叫？",
  baa: "谁会咩咩叫？", rooster: "谁会喔喔叫，叫大家起床？", oink: "谁会哼哼叫？", neigh: "谁会咴咴叫？",
  trunk: "谁有长长的鼻子？", neck: "谁的脖子特别长？", mane: "谁的脸周围有一大圈鬃毛？",
  ears: "谁有长长的耳朵？", shell: "谁背上有硬硬的龟壳？", snail: "谁背着小房子慢慢爬？",
  butterfly: "谁有彩色的翅膀，会飞？", honey: "谁会酿蜂蜜？", water: "谁生活在水里？",
  sweet: "什么是甜的？", sour: "什么吃起来酸酸的？", red: "图片里什么是红色的？",
  yellow: "图片里什么是黄色的？", green: "图片里什么是绿色的？", fruit: "哪个是水果？",
  drink: "什么可以喝？", cold: "什么冰冰凉凉，还会融化？", carrot: "兔子喜欢吃哪种蔬菜？",
  read: "什么可以用来阅读？", time: "什么可以告诉我们时间？", rain: "什么可以挡雨？",
  unlock: "什么可以开锁？", sleep: "我们在哪里睡觉？", sit: "我们坐在什么上面？",
  soup: "我们用什么喝汤？", teeth: "我们用什么刷牙？", draw: "我们用什么在纸上画画？",
  cut: "我们用什么剪纸？", head: "什么戴在头上？", hands: "什么能让手暖和？",
  feet: "什么穿在脚上？", rails: "什么在铁轨上行驶？", fly: "我们坐什么在天上飞？",
  sail: "我们坐什么在水上航行？", pedals: "什么有两个轮子和脚踏板？", space: "什么能飞到太空？",
  kick: "玩游戏时，我们可以踢什么？", strings: "哪种乐器有琴弦？", beat: "我们用小棒敲什么来演奏音乐？",
  snow: "我们用雪堆什么？", rainbow: "雨后天空中会出现什么，有很多颜色？", sun: "白天什么发光，让我们暖和？",
};
export const ui = {
  update: "更新游戏", appName: "词语和数字", auto: "自动", seed: "题目编号",
  gameNames: { initialSet: "找相同的拼音开头", countGroup: "数圆圈", memoryPairs: "记忆配对", letterOrder: "拼音排排队", firstLetter: "找拼音开头", describe: "听线索猜一猜", arithmetic: "加法和减法", compare: "比较大小", listenChoose: "听词选图", missingNumber: "找缺少的数字", makeAmount: "凑出数量", patternNext: "接着排图案" },
  patternNames: { circle: "圆形", square: "正方形", triangle: "三角形", diamond: "菱形", coral: "粉红色", teal: "蓝绿色", gold: "黄色", purple: "紫色" },
  play: "开始玩", next: "下一题", again: "再来一次", try: "再试试！", good: "真棒！", star: "得到一颗星星！", party: "星星庆典！",
  speaker: "再听一遍", parent: "家长入口", back: "返回", menu: "菜单", choose: "选择语言", parentQuestion: "12 + 7 等于多少？", parentWrong: "请再试一次", parentTitle: "家长菜单",
  install: "安装应用", installHelp: "打开浏览器菜单，选择“添加到主屏幕”或“安装应用”。", installDone: "应用已经安装了。",
  debug: "游戏试练", debugHint: "试练不会获得星星。", voice: "语音", voiceReady: "普通话录音", voiceMissing: "设备上没有普通话语音，请在设备设置中添加。", voiceTest: "试听语音",
  mute: "声音", volume: "音量", difficulty: "难度", reset: "重置进度", resetAsk: "要清除所有星星和答题进度吗？", level: ["简单", "中等", "进阶"],
  initialSet: (letter) => `找出名字的拼音以 ${letter} 开头的所有图片。`,
  countGroup: (n) => `哪里有${n}个圆圈？`, memoryPairs: "找出配对的词语和图片。", letterOrder: "按拼音表的顺序点一点。",
  firstLetter: (name) => `“${name}”的拼音以什么开头？`, firstLetterPicture: "图片名字的拼音以什么开头？",
  arithmetic: "算一算。", compare: "应该选哪个符号？", arithmeticSpeech: (a, b, plus) => `${a}${plus ? "加" : "减"}${b}，等于多少？`, compareSpeech: (a, b) => `${a}和${b}，应该选哪个符号？`,
  listenChoose: "听一听，选出图片。", missingNumber: "少了哪个数字？", makeAmount: (n) => `凑出${n}颗星星。点加号或减号。`, patternNext: "接下来是什么？",
  facts: { woof: clueText.woof, meow: clueText.meow, moo: clueText.moo, quack: clueText.quack, red: clueText.red, sweet: clueText.sweet },
  reactions: "图片伙伴", reactionPreview: "查看表情", artPreview: "所有图片", reactionNames: { thinking: "想一想", happy: "太好了！", sad: "再试试", surprised: "哇！", oops: "哎呀！", celebrating: "庆祝啦！" },
  audioLoading: "正在准备语音……", audioSpeaking: "仔细听……", audioError: "请点“再听一遍”，并检查网络和声音。", audioMuted: "声音已关闭",
  progress: (n) => `已完成 ${n} 题，完成 5 题得一颗星`, offline: "下载普通话语音，离线也能玩", offlineBusy: "正在下载……", offlineReady: "语音已保存，可以离线玩了", offlineError: "下载未完成，请检查网络后重试。",
  memoryHint: "翻开两张卡片，把词语和图片配成一对。", parentHint: "请算出答案，打开设置。",
};
export const speech = {
  numbers: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
  plus: "加", minus: "减", and: "和", answer: "等于多少？", first: "这个名字的拼音以什么开头？",
  letters: alphabet.map((letter) => soundExamples[letter]),
};
export function initialPrompt(letter) {
  return `找出名字的拼音开头和“${soundExamples[letter]}”一样的所有图片。`;
}
