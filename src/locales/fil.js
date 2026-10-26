// Modern Filipino: the 28-letter alphabet keeps Ñ and NG as separate letters.
export const vocabulary = {
 dog:"aso",cat:"pusa",juice:"dyus",sausage:"hotdog",sun:"araw",house:"bahay",banana:"saging",balloon:"lobo",milk:"gatas",window:"bintana",clock:"orasan",chocolate:"tsokolate",
 cow:"baka",book:"aklat",candy:"kendi",cake:"keyk",car:"kotse",duck:"pato",apple:"mansanas",fish:"isda",tree:"puno",flower:"bulaklak",ball:"bola",star:"bituin",shoe:"sapatos",
 rabbit:"kuneho",bear:"oso",lion:"leon",elephant:"elepante",giraffe:"dyirap",monkey:"unggoy",horse:"kabayo",sheep:"tupa",pig:"baboy",mouse:"daga",frog:"palaka",turtle:"pagong",
 butterfly:"paruparo",bee:"bubuyog",snail:"kuhol",bird:"ibon",rooster:"tandang",penguin:"pengguwin",pear:"peras",orange:"kahel",lemon:"limon",strawberry:"presa",grapes:"ubas",watermelon:"pakwan",
 carrot:"karot",tomato:"kamatis",cucumber:"pipino",bread:"tinapay",cheese:"keso",egg:"itlog",icecream:"sorbetes",pizza:"pitsa",bus:"bus",train:"tren",plane:"eroplano",boat:"bangka",
 bicycle:"bisikleta",rocket:"raket",umbrella:"payong",key:"susi",chair:"silya",bed:"kama",cup:"tasa",spoon:"kutsara",brush:"sepilyo",pencil:"lapis",scissors:"gunting",hat:"sumbrero",
 shirt:"kamiseta",sock:"medyas",mitten:"guwantes",drum:"tambol",guitar:"gitara",kite:"saranggola",moon:"buwan",cloud:"ulap",rainbow:"bahaghari",snowman:"taong niyebe",leaf:"dahon",mushroom:"kabute",shell:"kabibe",
};
export const alphabet = [..."ABCDEFGHIJKLMN","Ñ","NG",..."OPQRSTUVWXYZ"];
export const initial = (text) => /^ng/i.test(text) ? "NG" : [...text][0].toLocaleUpperCase("fil");
export const early = [..."ABDKLMPST"];
export const rows = [...Array.from({length:9},(_,index)=>alphabet.slice(index*3,index*3+3)),alphabet.slice(-3)];
export const clueText = {
 woof:"Aling hayop ang tumatahol?",meow:"Aling hayop ang ngumingiyaw?",moo:"Aling hayop ang umuunga?",quack:"Aling hayop ang kumukuwak?",baa:"Aling hayop ang humuhuni ng mee?",rooster:"Aling hayop ang tumitilaok?",oink:"Aling hayop ang umuungol ng oink?",neigh:"Aling hayop ang humahalinghing?",
 trunk:"Aling hayop ang may mahabang nguso na parang tubo?",neck:"Aling hayop ang may napakahabang leeg?",mane:"Aling hayop ang may makapal na buhok sa palibot ng mukha?",ears:"Aling hayop ang may mahahabang tainga?",shell:"Aling hayop ang may matigas na talukab sa likod?",snail:"Aling hayop ang gumagapang na may maliit na bahay sa likod?",butterfly:"Aling hayop ang lumilipad na may makukulay na pakpak?",honey:"Aling hayop ang gumagawa ng pulot?",water:"Aling hayop ang nakatira sa ilalim ng tubig?",
 sweet:"Ano ang matamis?",sour:"Ano ang maasim?",red:"Ano ang pula sa larawan?",yellow:"Ano ang dilaw sa larawan?",green:"Ano ang berde sa larawan?",fruit:"Alin ang prutas?",drink:"Ano ang puwedeng inumin?",cold:"Ano ang malamig at natutunaw?",carrot:"Anong gulay ang gusto ng kuneho?",
 read:"Ano ang puwedeng basahin?",time:"Ano ang nagsasabi ng oras?",rain:"Ano ang panangga sa ulan?",unlock:"Ano ang ginagamit para magbukas ng kandado?",sleep:"Saan tayo natutulog?",sit:"Ano ang inuupuan natin?",soup:"Ano ang ginagamit sa pagkain ng sopas?",teeth:"Ano ang ginagamit sa pagsisipilyo?",draw:"Ano ang ginagamit sa pagguhit sa papel?",cut:"Ano ang ginagamit sa paggupit ng papel?",head:"Ano ang isinusuot sa ulo?",hands:"Ano ang nagpapainit sa mga kamay?",feet:"Ano ang isinusuot sa mga paa?",
 rails:"Ano ang tumatakbo sa riles?",fly:"Ano ang sinasakyan para lumipad sa langit?",sail:"Ano ang sinasakyan sa tubig?",pedals:"Ano ang may dalawang gulong at mga pedal?",space:"Ano ang puwedeng lumipad sa kalawakan?",kick:"Ano ang sinisipa natin sa paglalaro?",strings:"Anong instrumento ang may mga kuwerdas?",beat:"Ano ang pinapalo ng mga patpat para gumawa ng musika?",snow:"Ano ang ginagawa natin mula sa niyebe?",rainbow:"Ano ang makulay na lumilitaw sa langit pagkatapos ng ulan?",sun:"Ano ang nagbibigay ng liwanag at init sa araw?",
};
export const ui = {
 update:"I-update ang laro",appName:"Salita at Bilang kasama si Bar",auto:"Awtomatiko",seed:"Numero ng tanong",
 gameNames:{initialSet:"Mga unang titik",countGroup:"Bilangin ang mga bilog",memoryPairs:"Maghanap ng pares",letterOrder:"Ayusin ang mga titik",firstLetter:"Unang titik",describe:"Mga palaisipan",arithmetic:"Dagdag at bawas",compare:"Ihambing ang mga bilang",listenChoose:"Makinig at pumili",missingNumber:"Nawawalang bilang",makeAmount:"Buuin ang dami",patternNext:"Ituloy ang padron"},
 patternNames:{circle:"bilog",square:"parisukat",triangle:"tatsulok",diamond:"diyamante",coral:"rosas",teal:"asul-berde",gold:"dilaw",purple:"lila"},
 play:"Maglaro",next:"Susunod",again:"Ulit",try:"Subukan muli!",good:"Magaling!",star:"Bagong bituin!",party:"Pagdiriwang ng mga bituin!",speaker:"Pakinggan muli",parent:"Para sa matatanda",back:"Bumalik",menu:"Menu",choose:"Pumili ng wika",parentQuestion:"Ano ang sagot sa 12 + 7?",parentWrong:"Subukan muli",parentTitle:"Menu para sa matatanda",
 install:"I-install ang app",installHelp:"Buksan ang menu ng browser at piliin ang Idagdag sa Home Screen o I-install ang app.",installDone:"Naka-install na ang app.",
 debug:"Subukan ang mga laro",debugHint:"Walang bituin sa mga tanong na pansubok.",voice:"Boses",voiceReady:"Naka-record na boses sa Filipino",voiceMissing:"Walang boses sa Filipino sa aparatong ito. Magdagdag sa mga setting ng aparato.",voiceTest:"Subukan ang boses",
 mute:"Tunog",volume:"Lakas ng tunog",difficulty:"Hirap",reset:"Burahin ang progreso",resetAsk:"Burahin ang lahat ng bituin at progreso?",level:["Madali","Katamtaman","Mas mahirap"],
 initialSet:(letter)=>`Pindutin ang lahat ng larawang nagsisimula sa titik ${letter}.`,countGroup:(n)=>`Nasaan ang pangkat na may ${n} bilog?`,
 memoryPairs:"Itambal ang salita at ang larawan.",letterOrder:"Pindutin ang mga titik ayon sa alpabeto.",firstLetter:(name)=>`Ano ang unang titik ng salitang ${name}?`,firstLetterPicture:"Ano ang unang titik ng pangalan ng larawang ito?",
 arithmetic:"Kuwentahin ang sagot.",compare:"Aling tanda ang tama?",arithmeticSpeech:(a,b,plus)=>`${a} ${plus?"dagdag":"bawas"} ${b}. Ano ang sagot?`,compareSpeech:(a,b)=>`${a} at ${b}. Aling tanda ang tama?`,
 listenChoose:"Makinig at piliin ang larawan.",missingNumber:"Anong bilang ang nawawala?",makeAmount:(n)=>`Gumawa ng ${n} bituin. Pindutin ang plus o minus.`,patternNext:"Ano ang susunod?",
 facts:{woof:clueText.woof,meow:clueText.meow,moo:clueText.moo,quack:clueText.quack,red:clueText.red,sweet:clueText.sweet},
 reactions:"Kaibigang larawan",reactionPreview:"Tingnan ang mga ekspresyon",artPreview:"Lahat ng larawan",reactionNames:{thinking:"Nag-iisip",happy:"Magaling!",sad:"Subukan natin muli",surprised:"Wow!",oops:"Ay!",celebrating:"Magdiwang!"},
 audioLoading:"Inihahanda ang boses…",audioSpeaking:"Makinig…",audioError:"Pindutin ang Pakinggan muli. Tingnan ang koneksyon at tunog.",audioMuted:"Naka-off ang tunog",progress:(n)=>`${n} sa 5 para sa isang bituin`,offline:"I-download ang boses sa Filipino para makapaglaro nang walang internet",offlineBusy:"Nagda-download…",offlineReady:"Nai-save ang boses para makapaglaro nang walang internet",offlineError:"Hindi natapos ang pag-download. Tingnan ang koneksyon at subukang muli.",memoryHint:"Baligtarin ang dalawang kard. Itambal ang salita sa larawan nito.",parentHint:"Sagutin ang pagdaragdag para buksan ang mga setting.",
};
export const speech = {
 numbers:["sero","isa","dalawa","tatlo","apat","lima","anim","pito","walo","siyam","sampu"],
 plus:"dagdag",minus:"bawas",and:"at",answer:"Ano ang sagot?",
 first:"Ano ang unang titik ng salitang ito?",
 letters:["ey","bi","si","di","i","ef","dyi","eyts","ay","dyey","key","el","em","en","enye","en dyi","o","pi","kyu","ar","es","ti","yu","vi","dobolyu","eks","way","zi"],
};

// Native linking forms avoid asking the speech engine to infer how digits attach to nouns.
const quantities=[null,"isang","dalawang","tatlong","apat na","limang","anim na","pitong","walong","siyam na","sampung"];
export function quantity(kind,n){
 if(!Number.isInteger(n)||n<1||n>10)throw new RangeError(`Unsupported Filipino quantity: ${n}`);
 if(kind==="countGroup")return `Nasaan ang pangkat na may ${quantities[n]} bilog?`;
 if(kind==="makeAmount")return `Gumawa ng ${quantities[n]} bituin. Pindutin ang plus o minus.`;
 throw new RangeError(`Unsupported Filipino activity: ${kind}`);
}
