import test from 'node:test';
import assert from 'node:assert/strict';
import {parseHTML} from 'linkedom';
import {readFileSync,statSync} from 'node:fs';
import {languages,copy,t} from '../src/core/i18n.js';
import {concepts,word,alphabets} from '../src/core/content.js';
import {clues} from '../src/core/clues.js';
import {alphabet,rows,initial} from '../src/locales/fil.js';
import {spoken,quantitySpeech,mathSpeech,comparisonSpeech,speechCatalog} from '../src/core/speech.js';
import {audioManifest} from '../src/core/audio-manifest.js';
import {letterOrder} from '../src/games/letterOrder.js';
import {firstLetter} from '../src/games/firstLetter.js';
import {seeded} from '../src/core/helpers.js';
import {readProgress,award} from '../src/core/rewards.js';

test('Filipino appears last, has complete UI and vocabulary, and retains its 28-letter alphabet',()=>{
 assert.equal(languages.at(-1).code,'fil');assert.equal(languages.at(-1).tag,'fil-PH');
 for(const key of Object.keys(copy.en))assert.ok(copy.fil[key]!==undefined,`Filipino UI: ${key}`);
 for(const item of concepts){assert.ok(word(item,'fil').display);assert.ok(alphabets.fil.includes(word(item,'fil').initial));}
 for(const clue of clues)assert.ok(clue.prompts.fil);
 assert.equal(alphabet.length,28);assert.deepEqual(alphabet.slice(13,17),['N','Ñ','NG','O']);
 assert.equal(initial('ngiti'),'NG');assert.equal(initial('Ñora'),'Ñ');
 assert.deepEqual(new Set(rows.flat()),new Set(alphabet));assert.ok(rows.every(row=>row.length===3));
});

test('counting, arithmetic and comparison use Filipino number names and native linking forms',()=>{
 assert.deepEqual(spoken.fil.numbers,['sero','isa','dalawa','tatlo','apat','lima','anim','pito','walo','siyam','sampu']);
 assert.equal(quantitySpeech('fil','countGroup',2),'Nasaan ang pangkat na may dalawang bilog?');
 assert.equal(quantitySpeech('fil','makeAmount',4),'Gumawa ng apat na bituin. Pindutin ang plus o minus.');
 assert.deepEqual(mathSpeech('fil',3,1,false),['tatlo','bawas','isa','Ano ang sagot?']);
 assert.deepEqual(comparisonSpeech('fil',2,5),['dalawa','at','lima',t('fil','compare')]);
 for(let n=1;n<=10;n++)assert.doesNotMatch(quantitySpeech('fil','countGroup',n),/\d/);
});

test('Filipino NG remains one letter-order tile and taps pronounce letter names',()=>{
 const {document}=parseHTML('<main></main>');globalThis.document=document;
 const task=letterOrder.create({locale:'fil',level:3,rng:seeded(1),choose:(_key,pool)=>pool.find(run=>run.letters.join('|')==='N|Ñ|NG|O')});
 assert.deepEqual(task.answer,['N','Ñ','NG','O']);
 assert.deepEqual(task.speech,[t('fil','letterOrder'),'en','enye','en dyi','o']);
 const host=document.querySelector('main'),said=[];let wins=0,done=false;
 task.render(host,{audio:{speak:(text,locale)=>said.push({text,locale})},isComplete:()=>done,wrong(){},complete(){wins++;done=true;}});
 const tile=letter=>[...host.querySelectorAll('button')].find(button=>button.textContent===letter);
 assert.equal(tile('NG').textContent,'NG');
 for(const [letter,name] of [['N','en'],['Ñ','enye'],['NG','en dyi'],['O','o']]){tile(letter).click();assert.deepEqual(said.at(-1),{text:name,locale:'fil'});}
 assert.equal(wins,1);const count=said.length;tile('NG').click();assert.equal(said.length,count);
});

test('first-letter choices say their names and preserve the final letter before the complete word',()=>{
 const {document}=parseHTML('<main></main>');globalThis.document=document;
 const task=firstLetter.create({locale:'fil',level:2,rng:seeded(4)}),said=[];
 assert.deepEqual(task.speech.slice(2),task.options.map(letter=>spoken.fil.letters[alphabet.indexOf(letter)]));
 const host=document.querySelector('main');task.render(host,{locale:'fil',audio:{speak:text=>said.push(text)},wrong(){},complete(){}});
 const buttons=[...host.querySelectorAll('button')],wrong=task.options.find(letter=>letter!==task.answer);
 buttons[task.options.indexOf(wrong)].click();assert.equal(said.at(-1),spoken.fil.letters[alphabet.indexOf(wrong)]);
 buttons[task.options.indexOf(task.answer)].click();assert.deepEqual(said.at(-1),[spoken.fil.letters[alphabet.indexOf(task.answer)],word(concepts.find(item=>item.id===task.key),'fil').speech]);
});

test('all Filipino narration is recorded and install recovery includes the language',()=>{
 for(const text of speechCatalog('fil')){const path=audioManifest.fil[text];assert.ok(path,text);assert.ok(statSync(new URL('../'+path,import.meta.url)).size>1000,path);}
 const {document}=parseHTML(readFileSync(new URL('../update.html',import.meta.url),'utf8'));
 assert.equal(document.querySelector('option[value="fil"]').textContent,'🇵🇭 Filipino');
});

test('adding Filipino keeps older stars, language progress and settings',()=>{
 const old=globalThis.localStorage,saved=new Map([
  ['little-language-quest-progress-v1',JSON.stringify({correct:17,byLocale:{he:12,tr:5},skills:{'he:countGroup':8}})],['llq-volume','135'],['llq-hebrew-voice-blue-v1','recorded'],
 ]);
 globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value)};
 try{const progress=readProgress();assert.equal(progress.byLocale.fil,0);award(progress,'fil','countGroup');const next=readProgress();assert.equal(next.correct,18);assert.equal(next.byLocale.he,12);assert.equal(next.byLocale.tr,5);assert.equal(next.byLocale.fil,1);assert.equal(next.skills['he:countGroup'],8);assert.equal(saved.get('llq-volume'),'135');assert.equal(saved.get('llq-hebrew-voice-blue-v1'),'recorded');}
 finally{globalThis.localStorage=old;}
});
