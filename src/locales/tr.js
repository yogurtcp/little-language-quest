// Turkish uses its own 29-letter alphabet, including dotted İ and dotless I.
export const vocabulary = {
  dog: "köpek", cat: "kedi", juice: "meyve suyu", sausage: "sosis", sun: "güneş", house: "ev",
  banana: "muz", balloon: "balon", milk: "süt", window: "pencere", clock: "saat", chocolate: "çikolata",
  cow: "inek", book: "kitap", candy: "şeker", cake: "pasta", car: "araba", duck: "ördek",
  apple: "elma", fish: "balık", tree: "ağaç", flower: "çiçek", ball: "top", star: "yıldız", shoe: "ayakkabı",
  rabbit: "tavşan", bear: "ayı", lion: "aslan", elephant: "fil", giraffe: "zürafa", monkey: "maymun",
  horse: "at", sheep: "koyun", pig: "domuz", mouse: "fare", frog: "kurbağa", turtle: "kaplumbağa",
  butterfly: "kelebek", bee: "arı", snail: "salyangoz", bird: "kuş", rooster: "horoz", penguin: "penguen",
  pear: "armut", orange: "portakal", lemon: "limon", strawberry: "çilek", grapes: "üzüm", watermelon: "karpuz",
  carrot: "havuç", tomato: "domates", cucumber: "salatalık", bread: "ekmek", cheese: "peynir", egg: "yumurta",
  icecream: "dondurma", pizza: "pizza", bus: "otobüs", train: "tren", plane: "uçak", boat: "tekne",
  bicycle: "bisiklet", rocket: "roket", umbrella: "şemsiye", key: "anahtar", chair: "sandalye", bed: "yatak",
  cup: "fincan", spoon: "kaşık", brush: "diş fırçası", pencil: "kalem", scissors: "makas", hat: "şapka",
  shirt: "gömlek", sock: "çorap", mitten: "eldiven", drum: "davul", guitar: "gitar", kite: "uçurtma",
  moon: "ay", cloud: "bulut", rainbow: "gökkuşağı", snowman: "kardan adam", leaf: "yaprak", mushroom: "mantar", shell: "deniz kabuğu",
};
export const initial = (text) => [...text][0].toLocaleUpperCase("tr-TR");
export const alphabet = [..."ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ"];
export const early = [..."ABÇDEİKMS"];
export const rows = Array.from({ length: 8 }, (_, i) => alphabet.slice(i * 3, i * 3 + 3));
export const clueText = {
  woof: "Hangi hayvan hav hav der?", meow: "Hangi hayvan miyav der?", moo: "Hangi hayvan möö der?", quack: "Hangi hayvan vak vak der?",
  baa: "Hangi hayvan mee der?", rooster: "Hangi hayvan ü ürü ü diye öter?", oink: "Hangi hayvan homurdanır?", neigh: "Hangi hayvan kişner?",
  trunk: "Hangi hayvanın uzun bir hortumu var?", neck: "Hangi hayvanın boynu çok uzun?", mane: "Hangi hayvanın yüzünün çevresinde büyük bir yelesi var?",
  ears: "Hangi hayvanın uzun kulakları var?", shell: "Hangi hayvan sırtında sert bir kabuk taşır?", snail: "Hangi hayvan sırtında küçük bir evle yavaşça sürünür?",
  butterfly: "Hangi hayvan renkli kanatlarıyla uçar?", honey: "Hangi hayvan bal yapar?", water: "Hangi hayvan suyun altında yaşar?",
  sweet: "Hangisi tatlı?", sour: "Hangisinin tadı ekşi?", red: "Resimde hangisi kırmızı?", yellow: "Resimde hangisi sarı?", green: "Resimde hangisi yeşil?",
  fruit: "Hangisi bir meyve?", drink: "Hangisini içebiliriz?", cold: "Hangisi soğuktur ve erir?", carrot: "Tavşan hangi sebzeyi sever?",
  read: "Hangisini okuyabiliriz?", time: "Hangisi zamanı gösterir?", rain: "Hangisi bizi yağmurdan korur?", unlock: "Kilidi neyle açarız?",
  sleep: "Nerede uyuruz?", sit: "Neyin üzerine otururuz?", soup: "Çorbayı neyle içeriz?", teeth: "Dişlerimizi neyle fırçalarız?",
  draw: "Kâğıda neyle resim çizeriz?", cut: "Kâğıdı neyle keseriz?", head: "Başımıza ne takarız?", hands: "Ellerimizi ne sıcak tutar?",
  feet: "Ayağımıza ne giyeriz?", rails: "Hangisi rayların üzerinde gider?", fly: "Gökyüzünde neyle yolculuk ederiz?", sail: "Suda neyle yolculuk ederiz?",
  pedals: "Hangisinin iki tekerleği ve pedalları var?", space: "Hangisi uzaya uçabilir?", kick: "Oynarken hangisine tekme atabiliriz?",
  strings: "Hangi müzik aletinin telleri var?", beat: "Müzik yapmak için hangisine çubuklarla vururuz?", snow: "Kardan ne yaparız?",
  rainbow: "Yağmurdan sonra gökyüzünde beliren renkli şey nedir?", sun: "Gündüzleri hangisi parlar ve bizi ısıtır?",
};
export const ui = {
  update: "Oyunu güncelle", appName: "Kelimeler ve Sayılar", auto: "Otomatik", seed: "Soru numarası",
  gameNames: { initialSet: "Harfle başlayan resimler", countGroup: "Daireleri say", memoryPairs: "Eşini bul", letterOrder: "Harfleri sırala", firstLetter: "İlk harf", describe: "İpucundan bul", arithmetic: "Toplama ve çıkarma", compare: "Sayıları karşılaştır", listenChoose: "Dinle ve seç", missingNumber: "Eksik sayı", makeAmount: "İstenen sayıyı yap", patternNext: "Örüntüyü tamamla" },
  patternNames: { circle: "daire", square: "kare", triangle: "üçgen", diamond: "eşkenar dörtgen", coral: "pembe", teal: "turkuaz", gold: "sarı", purple: "mor" },
  play: "Oyna", next: "Sonraki", again: "Bir daha", try: "Bir daha dene!", good: "Aferin!", star: "Yeni bir yıldız!", party: "Yıldız kutlaması!",
  speaker: "Tekrar dinle", parent: "Yetişkinler için", back: "Geri", menu: "Menü", choose: "Dil seç", parentQuestion: "12 + 7 kaç eder?", parentWrong: "Tekrar deneyin", parentTitle: "Yetişkin menüsü",
  install: "Uygulamayı yükle", installHelp: "Tarayıcı menüsünden Ana ekrana ekle veya Uygulamayı yükle seçeneğini seçin.", installDone: "Uygulama zaten yüklü.",
  debug: "Oyunları dene", debugHint: "Deneme soruları yıldız kazandırmaz.", voice: "Ses", voiceReady: "Kayıtlı Türkçe ses", voiceMissing: "Bu cihazda Türkçe ses yok. Cihaz ayarlarından ekleyin.", voiceTest: "Sesi dene",
  mute: "Ses", volume: "Ses düzeyi", difficulty: "Zorluk", reset: "İlerlemeyi sıfırla", resetAsk: "Tüm yıldızlar ve ilerleme silinsin mi?", level: ["Kolay", "Orta", "Daha zor"],
  initialSet: (letter) => `Adı ${letter} harfiyle başlayan bütün resimlere dokun.`, countGroup: (n) => `${n} daire nerede?`,
  memoryPairs: "Kelimeleri resimleriyle eşleştir.", letterOrder: "Harflere alfabe sırasıyla dokun.", firstLetter: (name) => `${name} kelimesinin ilk harfi ne?`, firstLetterPicture: "Resmin adının ilk harfi ne?",
  arithmetic: "İşlemi çöz.", compare: "Hangi işaret uygun?", arithmeticSpeech: (a, b, plus) => `${a} ${plus ? "artı" : "eksi"} ${b}. Sonuç kaç?`, compareSpeech: (a, b) => `${a} ve ${b}. Hangi işaret uygun?`,
  listenChoose: "Dinle ve resmi seç.", missingNumber: "Hangi sayı eksik?", makeAmount: (n) => `${n} yıldız yap. Artıya veya eksiye dokun.`, patternNext: "Sırada ne var?",
  facts: { woof: clueText.woof, meow: clueText.meow, moo: clueText.moo, quack: clueText.quack, red: clueText.red, sweet: clueText.sweet },
  reactions: "Resim arkadaşım", reactionPreview: "Yüz ifadelerine bak", artPreview: "Bütün resimler", reactionNames: { thinking: "Düşünüyor", happy: "Yaşasın!", sad: "Bir daha deneyelim", surprised: "Vay!", oops: "Hay aksi!", celebrating: "Kutluyor!" },
  audioLoading: "Ses hazırlanıyor…", audioSpeaking: "Dinle…", audioError: "Tekrar dinle düğmesine dokun. Bağlantıyı ve sesi kontrol et.", audioMuted: "Ses kapalı",
  progress: (n) => `Yıldız için 5 sorudan ${n} tanesi tamamlandı`, offline: "Çevrimdışı oynamak için Türkçe sesleri indir", offlineBusy: "İndiriliyor…", offlineReady: "Sesler çevrimdışı oyun için kaydedildi", offlineError: "İndirme tamamlanamadı. Bağlantıyı kontrol edip yeniden deneyin.",
  memoryHint: "İki kart aç. Kelimeyi resmiyle eşleştir.", parentHint: "Ayarları açmak için işlemi çözün.",
};
export const speech = {
  numbers: ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on"],
  plus: "artı", minus: "eksi", and: "ve", answer: "Sonuç kaç?", first: "Bu kelimenin ilk harfi ne?",
  letters: ["a", "be", "ce", "çe", "de", "e", "fe", "ge", "yumuşak ge", "he", "ı", "i", "je", "ke", "le", "me", "ne", "o", "ö", "pe", "re", "se", "şe", "te", "u", "ü", "ve", "ye", "ze"],
};
