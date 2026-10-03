import { node, button } from './core/helpers.js';
import { languages, copy, t } from './core/i18n.js';
import { GameAudio } from './core/audio.js';
import { nextTask } from './core/scheduler.js';
import { readProgress, resetProgress, award } from './core/rewards.js';
import { games } from './games/index.js';

const app = document.querySelector('#app');
const audio = new GameAudio();
let locale = null;
let progress = readProgress();
let levelOverride = Number(localStorage.getItem('llq-level')) || 0;
let recentTypes = [];
let active = null;
let advanceTimer = null;
let installPrompt = null;
let parentHold = null;

window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; });
window.addEventListener('appinstalled', () => { installPrompt = null; });
if ('serviceWorker' in navigator && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.warn));

function clear() { clearTimeout(advanceTimer); app.replaceChildren(); }
function setLanguage(code) {
  locale = code;
  document.documentElement.lang = languages.find(lang=>lang.code===code).tag;
  document.documentElement.dir = code === 'he' ? 'rtl' : 'ltr';
  document.title = t(code,'appName');
}
function header({ parent = true } = {}) {
  const bar = node('header','topbar');
  const brand = node('div','brand');
  brand.innerHTML = '<span class="brand-mark">✦</span>';
  brand.append(node('span','brand-name',t(locale,'appName')));
  bar.append(brand);
  if (parent) {
    const gate = button('parent-gate','⚙',()=>{});
    gate.title = t(locale,'parent');
    gate.setAttribute('aria-label',t(locale,'parent'));
    gate.addEventListener('pointerdown',()=> { parentHold = setTimeout(showParentQuestion,2200); gate.classList.add('holding'); });
    for (const name of ['pointerup','pointerleave','pointercancel']) gate.addEventListener(name,()=>{ clearTimeout(parentHold); gate.classList.remove('holding'); });
    gate.addEventListener('contextmenu',event=>event.preventDefault());
    bar.append(gate);
  }
  return bar;
}
function languagePicker() {
  locale = null; document.documentElement.lang='en'; document.documentElement.dir='ltr'; document.title='Little Language Quest'; clear();
  const screen=node('main','screen launch-screen');
  const badge=node('div','launch-badge','✦  ✿  ★');
  const heading=node('h1','launch-title','Little Language Quest');
  const subtitle=node('p','launch-subtitle','Choose a language · Выбери язык · בְּחַר שָׂפָה');
  const choices=node('div','language-choices');
  languages.forEach(lang=>{
    const choice=button('language-choice','',()=>{setLanguage(lang.code); welcome();});
    choice.innerHTML=`<span class="language-sample" dir="${lang.code==='he'?'rtl':'ltr'}">${lang.flag}</span><span>${lang.name}</span><span class="choice-arrow">↗</span>`;
    choices.append(choice);
  });
  screen.append(badge,heading,subtitle,choices); app.append(screen);
}
function welcome() {
  clear();
  const screen=node('main','screen welcome-screen');
  screen.append(header());
  const hero=node('section','welcome-card');
  hero.innerHTML='<div class="welcome-art"><span>★</span><span>●</span><span>▲</span></div>';
  hero.append(node('h1','welcome-title',t(locale,'play')));
  const play=button('primary-button play-button',t(locale,'play'),async()=>{ try { await audio.unlock(); } catch {} startTask(); });
  hero.append(play);
  screen.append(hero);
  const change=button('text-button',t(locale,'choose'),languagePicker);
  screen.append(change); app.append(screen);
}
function currentLevel() { return levelOverride || Math.min(3,1+Math.floor((progress.byLocale[locale]||0)/12)); }
function starRail() {
  const stars=Math.floor(progress.correct/5);
  const filled=stars%5;
  const rail=node('div','star-rail');
  rail.setAttribute('aria-label',`${stars} ★`);
  for(let i=0;i<5;i++) rail.append(node('span',i<filled?'filled':'','★'));
  rail.append(node('span','star-count',String(stars)));
  return rail;
}
function startTask({ gameId = null, seed = null, practice = false } = {}) {
  clear();
  const gamePool=gameId?games.filter(game=>game.id===gameId):games;
  const selected=nextTask(gamePool,locale,currentLevel(),gameId?[]:recentTypes,seed===null?undefined:seed);
  if (!gameId) recentTypes=[...recentTypes.slice(-3),selected.game.id];
  active={...selected,practice,complete:false,misses:0};
  const screen=node('main','screen game-screen');
  screen.append(header());
  const stage=node('section','stage');
  const meta=node('div','stage-meta');
  meta.append(starRail());
  const actions=node('div','stage-actions');
  const replay=button('icon-button','◖))',()=>audio.speak(selected.task.speech||selected.task.prompt,locale));
  replay.setAttribute('aria-label',t(locale,'speaker'));
  actions.append(replay);
  if (practice) actions.append(button('text-button',t(locale,'debug'),gameLab));
  meta.append(actions); stage.append(meta);
  const title=node('h1','task-prompt',selected.task.prompt);
  stage.append(title);
  const field=node('div','task-field'); stage.append(field);
  const feedback=node('div','feedback'); feedback.setAttribute('aria-live','polite'); stage.append(feedback);
  const api={
    locale, audio,
    wrong(element, replayHint=true) {
      if (active.complete) return;
      active.misses++;
      audio.effect('wrong');
      feedback.textContent=t(locale,'try'); feedback.className='feedback retry';
      if (element) { element.classList.remove('wiggle'); void element.offsetWidth; element.classList.add('wiggle'); }
      if (active.misses>=2 && replayHint) setTimeout(()=>audio.speak(selected.task.speech||selected.task.prompt,locale),300);
    },
    complete() {
      if (active.complete) return;
      active.complete=true;
      audio.effect('right');
      feedback.textContent=t(locale,'good'); feedback.className='feedback success';
      if (!practice) {
        const result=award(progress,locale); progress=result.progress;
        meta.replaceChild(starRail(),meta.firstChild);
        if (result.star) { audio.effect('star'); showReward(stage,result.celebrate); return; }
        stage.append(button('primary-button next-button',t(locale,'next'),()=>startTask()));
        advanceTimer=setTimeout(()=>startTask(),1800);
      } else {
        const next=button('primary-button next-button',t(locale,'debug'),gameLab);
        stage.append(next);
      }
    }
  };
  selected.task.render(field,api);
  screen.append(stage); app.append(screen);
  advanceTimer=setTimeout(()=>audio.speak(selected.task.speech||selected.task.prompt,locale),180);
}
function showReward(stage, celebrate) {
  const overlay=node('div',`reward-overlay ${celebrate?'celebration':''}`);
  overlay.innerHTML=`<div class="reward-confetti"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="reward-star">★</div>`;
  overlay.append(node('h2','reward-title',t(locale,celebrate?'party':'star')));
  overlay.append(button('primary-button',t(locale,'next'),()=>startTask()));
  stage.append(overlay);
}
function showParentQuestion() {
  clearTimeout(parentHold);
  const shade=node('div','modal-shade');
  const modal=node('div','parent-modal');
  modal.append(node('h2','',t(locale,'parentQuestion')));
  const input=node('input','parent-answer'); input.type='number'; input.inputMode='numeric'; input.autocomplete='off';
  const note=node('p','parent-note');
  const row=node('div','modal-actions');
  row.append(button('secondary-button',t(locale,'back'),()=>shade.remove()));
  row.append(button('primary-button','✓',()=>{
    if (Number(input.value)===19) { shade.remove(); parentMenu(); }
    else { note.textContent=t(locale,'parentWrong'); input.value=''; input.focus(); }
  }));
  input.addEventListener('keydown',e=>{if(e.key==='Enter') row.lastChild.click();});
  modal.append(input,note,row); shade.append(modal); document.body.append(shade); input.focus();
}
function panelShell(title) {
  clear();
  const screen=node('main','screen parent-screen'); screen.append(header({parent:false}));
  const panel=node('section','parent-panel');
  const top=node('div','panel-heading'); top.append(node('h1','',title)); top.append(button('secondary-button',t(locale,'back'),welcome));
  panel.append(top); screen.append(panel); app.append(screen); return panel;
}
function parentMenu() {
  const panel=panelShell(t(locale,'parentTitle'));
  const language=node('div','setting-row'); language.append(node('label','',t(locale,'choose')));
  const select=node('select','setting-select'); languages.forEach(lang=>{const option=node('option','',lang.name);option.value=lang.code;option.selected=lang.code===locale;select.append(option);});
  select.addEventListener('change',()=>{setLanguage(select.value);parentMenu();}); language.append(select);panel.append(language);
  const sound=node('div','setting-row');sound.append(node('label','',t(locale,'mute')));
  const toggle=node('input');toggle.type='checkbox';toggle.checked=!audio.muted;toggle.addEventListener('change',()=>audio.setMuted(!toggle.checked));sound.append(toggle);panel.append(sound);
  const level=node('div','setting-row');level.append(node('label','',t(locale,'difficulty')));
  const levelSelect=node('select','setting-select');
  [0,1,2,3].forEach(value=>{const option=node('option','',value===0?t(locale,'auto'):copy[locale].level[value-1]);option.value=value;option.selected=levelOverride===value;levelSelect.append(option);});
  levelSelect.addEventListener('change',()=>{levelOverride=Number(levelSelect.value);localStorage.setItem('llq-level',String(levelOverride));});level.append(levelSelect);panel.append(level);
  const voice=node('div','setting-row');voice.append(node('label','',t(locale,'voice')));audio.refreshVoices();voice.append(node('span',audio.voice(locale)?'voice-ok':'voice-warning',t(locale,audio.voice(locale)?'voiceReady':'voiceMissing')));panel.append(voice);
  panel.append(button('wide-button',t(locale,'install'),installApp));
  panel.append(button('wide-button',t(locale,'debug'),gameLab));
  panel.append(button('wide-button danger',t(locale,'reset'),()=>{if(confirm(t(locale,'resetAsk'))){progress=resetProgress();parentMenu();}}));
  panel.append(button('wide-button subtle',t(locale,'choose'),languagePicker));
}
async function installApp() {
  if (installPrompt) { const event=installPrompt; installPrompt=null; await event.prompt(); }
  else alert(t(locale,'installHelp'));
}
function gameLab() {
  const panel=panelShell(t(locale,'debug'));
  panel.append(node('p','panel-note',t(locale,'debugHint')));
  const seedRow=node('div','setting-row'); seedRow.append(node('label','',t(locale,'seed')));
  const seedInput=node('input','seed-input'); seedInput.type='number'; seedInput.value=String(Math.floor(Math.random()*100000));seedRow.append(seedInput);panel.append(seedRow);
  const list=node('div','lab-grid');
  games.forEach((game,index)=>{
    const card=button('lab-card',`${String(index+1).padStart(2,'0')}  ${copy[locale].gameNames[game.id]}`,()=>startTask({gameId:game.id,seed:Number(seedInput.value),practice:true}));
    list.append(card);
  });
  panel.append(list);
  panel.append(button('secondary-button',t(locale,'menu'),parentMenu));
}
document.addEventListener('keydown',event=>{ if (locale && event.altKey && event.shiftKey && event.key.toLowerCase()==='p') showParentQuestion(); });
languagePicker();
