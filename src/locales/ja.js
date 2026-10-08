// Preschool display uses hiragana; conventional spelling guides the recorded voice.
export const vocabulary = {
  dog: ["いぬ", "犬"], cat: ["ねこ", "猫"], juice: ["じゅーす", "ジュース"],
  sausage: ["そーせーじ", "ソーセージ"], sun: ["たいよう", "太陽"], house: ["いえ", "家"],
  banana: ["ばなな", "バナナ"], balloon: ["ふうせん", "風船"], milk: ["ぎゅうにゅう", "牛乳"],
  window: ["まど", "窓"], clock: ["とけい", "時計"], chocolate: ["ちょこれーと", "チョコレート"],
  cow: ["うし", "牛"], book: ["ほん", "本"], candy: ["あめ", "飴"],
  cake: ["けーき", "ケーキ"], car: ["くるま", "車"], duck: ["あひる", "アヒル"],
  apple: ["りんご", "りんご"], fish: ["さかな", "魚"], tree: ["き", "木"],
  flower: ["はな", "花"], ball: ["ぼーる", "ボール"], star: ["ほし", "星"],
  shoe: ["くつ", "靴"], rabbit: ["うさぎ", "うさぎ"], bear: ["くま", "熊"],
  lion: ["らいおん", "ライオン"], elephant: ["ぞう", "象"], giraffe: ["きりん", "キリン"],
  monkey: ["さる", "猿"], horse: ["うま", "馬"], sheep: ["ひつじ", "羊"],
  pig: ["ぶた", "豚"], mouse: ["ねずみ", "ネズミ"], frog: ["かえる", "カエル"],
  turtle: ["かめ", "亀"], butterfly: ["ちょうちょ", "ちょうちょ"], bee: ["はち", "蜂"],
  snail: ["かたつむり", "カタツムリ"], bird: ["とり", "鳥"], rooster: ["にわとり", "鶏"],
  penguin: ["ぺんぎん", "ペンギン"], pear: ["なし", "梨"], orange: ["おれんじ", "オレンジ"],
  lemon: ["れもん", "レモン"], strawberry: ["いちご", "いちご"], grapes: ["ぶどう", "ぶどう"],
  watermelon: ["すいか", "スイカ"], carrot: ["にんじん", "にんじん"], tomato: ["とまと", "トマト"],
  cucumber: ["きゅうり", "きゅうり"], bread: ["ぱん", "パン"], cheese: ["ちーず", "チーズ"],
  egg: ["たまご", "卵"], icecream: ["あいすくりーむ", "アイスクリーム"], pizza: ["ぴざ", "ピザ"],
  bus: ["ばす", "バス"], train: ["でんしゃ", "電車"], plane: ["ひこうき", "飛行機"],
  boat: ["ふね", "船"], bicycle: ["じてんしゃ", "自転車"], rocket: ["ろけっと", "ロケット"],
  umbrella: ["かさ", "傘"], key: ["かぎ", "鍵"], chair: ["いす", "椅子"],
  bed: ["べっど", "ベッド"], cup: ["こっぷ", "コップ"], spoon: ["すぷーん", "スプーン"],
  brush: ["はぶらし", "歯ブラシ"], pencil: ["えんぴつ", "鉛筆"], scissors: ["はさみ", "はさみ"],
  hat: ["ぼうし", "帽子"], shirt: ["しゃつ", "シャツ"], sock: ["くつした", "靴下"],
  mitten: ["てぶくろ", "手袋"], drum: ["たいこ", "太鼓"], guitar: ["ぎたー", "ギター"],
  kite: ["たこ", "凧"], moon: ["つき", "月"], cloud: ["くも", "雲"],
  rainbow: ["にじ", "虹"], snowman: ["ゆきだるま", "雪だるま"], leaf: ["はっぱ", "葉っぱ"],
  mushroom: ["きのこ", "きのこ"], shell: ["かいがら", "貝殻"],
};
export const rows = [
  [..."あいうえお"], [..."かきくけこ"], [..."さしすせそ"], [..."たちつてと"],
  [..."なにぬねの"], [..."はひふへほ"], [..."まみむめも"], [..."やゆよ"],
  [..."らりるれろ"], [..."わをん"],
];
export const alphabet = [...rows.flat(), ..."がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ"];
export const early = [..."あいうえおかきくけこさしすせそたちつてとはひふへほ"];
export const clueText = {
  woof: "わんわんと なくのは だれ？", meow: "にゃーにゃーと なくのは だれ？", moo: "もうもうと なくのは だれ？", quack: "がーがーと なくのは だれ？",
  baa: "めえめえと なくのは だれ？", rooster: "こけこっこーと なくのは だれ？", oink: "ぶーぶーと なくのは だれ？", neigh: "ひひーんと なくのは だれ？",
  trunk: "はなが ながいのは だれ？", neck: "くびが とても ながいのは だれ？", mane: "かおの まわりに たてがみが あるのは だれ？",
  ears: "みみが ながいのは だれ？", shell: "せなかに かたい こうらが あるのは だれ？", snail: "ちいさな おうちを せおって はうのは だれ？",
  butterfly: "きれいな いろの はねで とぶのは だれ？", honey: "はちみつを つくるのは だれ？", water: "みずの なかで くらすのは だれ？",
  sweet: "あまいのは どれ？", sour: "すっぱいのは どれ？", red: "えの なかで あかいのは どれ？",
  yellow: "えの なかで きいろいのは どれ？", green: "えの なかで みどりいろなのは どれ？", fruit: "くだものは どれ？",
  drink: "のめるものは どれ？", cold: "つめたくて とけるのは どれ？", carrot: "うさぎが すきな やさいは どれ？",
  read: "よむものは どれ？", time: "じかんを おしえてくれるのは どれ？", rain: "あめを よけるのは どれ？",
  unlock: "かぎあなに いれて あけるものは どれ？", sleep: "どこで ねむるかな？", sit: "なにに すわるかな？",
  soup: "すーぷを のむときに つかうのは どれ？", teeth: "はを みがくときに つかうのは どれ？", draw: "かみに えを かくときに つかうのは どれ？",
  cut: "かみを きるときに つかうのは どれ？", head: "あたまに かぶるものは どれ？", hands: "てを あたためるものは どれ？",
  feet: "あしに はくものは どれ？", rails: "せんろを はしるのは どれ？", fly: "そらを とぶときに のるのは どれ？",
  sail: "みずの うえを すすむときに のるのは どれ？", pedals: "ふたつの しゃりんと ぺだるが あるのは どれ？", space: "うちゅうへ とぶのは どれ？",
  kick: "あそぶときに けるものは どれ？", strings: "げんが ある がっきは どれ？", beat: "ばちで たたいて おとを だすのは どれ？",
  snow: "ゆきで つくるのは どれ？", rainbow: "あめの あとに あらわれる いろんないろの はしは どれ？", sun: "ひるに ひかって あたためてくれるのは どれ？",
};
export const ui = {
  update: "ゲームをこうしん", appName: "ことばと かず", auto: "じどう", seed: "もんだいのばんごう",
  gameNames: { initialSet: "おなじ もじで はじまる え", countGroup: "まるを かぞえよう", memoryPairs: "ことばと えの ぺあ", letterOrder: "もじを じゅんばんに", firstLetter: "さいしょの もじ", describe: "ひんとで あてよう", arithmetic: "たしざんと ひきざん", compare: "かずを くらべよう", listenChoose: "きいて えらぼう", missingNumber: "ぬけた かず", makeAmount: "ほしを そろえよう", patternNext: "つぎの もよう" },
  patternNames: { circle: "まる", square: "しかく", triangle: "さんかく", diamond: "ひしがた", coral: "ぴんく", teal: "あおみどり", gold: "きいろ", purple: "むらさき" },
  play: "あそぶ", next: "つぎへ", again: "もういちど", try: "もういちど やってみよう！", good: "よくできたね！", star: "ほしを もらったよ！", party: "ほしの おいわい！",
  speaker: "もういちど きく", parent: "おうちのひとへ", back: "もどる", menu: "めにゅー", choose: "ことばを えらぶ", parentQuestion: "12 + 7 は いくつ？", parentWrong: "もういちど おためしください", parentTitle: "おうちのひとの めにゅー",
  install: "アプリをインストール", installHelp: "ブラウザーのメニューで「ホーム画面に追加」または「アプリをインストール」を選んでください。", installDone: "アプリはインストール済みです。",
  debug: "ゲームをためす", debugHint: "おためしでは ほしは ふえません。", voice: "こえ", voiceReady: "にほんごの ろくおん", voiceMissing: "端末の設定で日本語の音声を追加してください。", voiceTest: "こえを ためす",
  mute: "おと", volume: "おとの おおきさ", difficulty: "むずかしさ", reset: "きろくを リセット", resetAsk: "すべての星と進み具合をリセットしますか？", level: ["やさしい", "ふつう", "むずかしい"],
  initialSet: (letter) => `「${letter}」で はじまる なまえの えを ぜんぶ えらぼう。`,
  countGroup: (n) => `まるが ${n}こ あるのは どれ？`, memoryPairs: "ことばと えの ぺあを みつけよう。", letterOrder: "あいうえおの じゅんばんで もじを おそう。",
  firstLetter: (name) => `「${name}」の さいしょの もじは なに？`, firstLetterPicture: "えの なまえの さいしょの もじは なに？",
  arithmetic: "けいさん しよう。", compare: "どの しるしが あうかな？", arithmeticSpeech: (a, b, plus) => `${a}${plus ? "たす" : "ひく"}${b}は、いくつ？`, compareSpeech: (a, b) => `${a}と${b}。どの しるしが あうかな？`,
  listenChoose: "よく きいて えを えらぼう。", missingNumber: "どの かずが ぬけているかな？", makeAmount: (n) => `ほしを ${n}こに しよう。ぷらすか まいなすを おしてね。`, patternNext: "つぎは どれかな？",
  facts: { woof: clueText.woof, meow: clueText.meow, moo: clueText.moo, quack: clueText.quack, red: clueText.red, sweet: clueText.sweet },
  reactions: "しゃしんの ともだち", reactionPreview: "ひょうじょうを みる", artPreview: "すべての え", reactionNames: { thinking: "かんがえちゅう", happy: "やったー！", sad: "もういちど", surprised: "わあ！", oops: "あれれ！", celebrating: "おいわい！" },
  audioLoading: "こえを じゅんびちゅう…", audioSpeaking: "きいてね…", audioError: "「もういちど きく」を おしてね。つうしんと おとを たしかめてね。", audioMuted: "おとは おやすみちゅう",
  progress: (n) => `ほしまで ${n} / 5 もん`, offline: "にほんごの こえを オフラインように ほぞん", offlineBusy: "ダウンロードちゅう…", offlineReady: "こえを ほぞんしたよ", offlineError: "ダウンロードできませんでした。接続を確認して再試行してください。",
  memoryHint: "かーどを ふたつ めくって、ことばと えを あわせよう。", parentHint: "けいさんに こたえると せっていが ひらきます。",
};
export const speech = {
  numbers: ["ゼロ", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう", "じゅう"],
  plus: "たす", minus: "ひく", and: "と", answer: "いくつになるかな？", first: "この なまえの さいしょの もじは なに？",
  letters: alphabet,
};
// Explicit counters avoid 1/6/8/10 being read without their geminate consonants.
export const counters = ["", "いっこ", "にこ", "さんこ", "よんこ", "ごこ", "ろっこ", "ななこ", "はっこ", "きゅうこ", "じゅっこ"];
export const quantity = (kind, n) => kind === "countGroup"
  ? `まるが ${counters[n]} あるのは どれ？`
  : `ほしを ${counters[n]}に しよう。プラスか マイナスを おしてね。`;
