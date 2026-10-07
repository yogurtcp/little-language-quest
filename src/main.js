import { node, button } from "./core/helpers.js";
import { languages, t } from "./core/i18n.js";
import { GameAudio } from "./core/audio.js";
import { nextTask, TaskScheduler } from "./core/scheduler.js";
import { readProgress, resetProgress, award } from "./core/rewards.js";
import { readSetting, writeSetting } from "./core/storage.js";
import { TaskLifetime } from "./core/lifecycle.js";
import { createParentUI } from "./ui/parents.js";
import { volumeControl } from "./ui/volume.js";
import { createReaction } from "./ui/reactions.js";
import { games } from "./games/index.js";

const app = document.querySelector("#app"),
  audio = new GameAudio();
let scheduler = new TaskScheduler(),
  progress = readProgress();
let locale = null,
  levelOverride = Number(readSetting("llq-level")) || 0;
let lifetime = null,
  installPrompt = null;
const parents = createParentUI({
  audio,
  locale: () => locale,
  level: () => levelOverride,
  setLevel(value) {
    levelOverride = value;
    writeSetting("llq-level", String(value));
  },
  setLanguage,
  panel: panelShell,
  install: installApp,
  languagePicker,
  startTask,
  reset() {
    progress = resetProgress();
    writeSetting("llq-decks-v2", "{}");
    scheduler = new TaskScheduler();
  },
});
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
});
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  document.querySelector(".welcome-install")?.remove();
});
if (
  "serviceWorker" in navigator &&
  !["localhost", "127.0.0.1"].includes(location.hostname)
) {
  let registration, checkingUpdate = false;
  async function checkForUpdate() {
    if (!registration || checkingUpdate || document.visibilityState === "hidden") return;
    checkingUpdate = true;
    try {
      await registration.update();
    } catch (error) {
      console.warn("App update check failed", error);
    } finally {
      checkingUpdate = false;
    }
  }
  document.addEventListener("visibilitychange", checkForUpdate);
  window.addEventListener("online", checkForUpdate);
  window.addEventListener("load", async () => {
    try {
      registration = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
      await checkForUpdate();
    } catch (error) {
      console.warn("Offline app registration failed", error);
    }
  });
  // Old cache-first installations must reload once to use the newly activated release.
  const hadController = Boolean(navigator.serviceWorker.controller);
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadController && !reloading && navigator.serviceWorker.controller) {
      reloading = true;
      location.reload();
    }
  });
}
function clear() {
  lifetime?.dispose();
  audio.onStatus = () => {};
  audio.stop();
  app.replaceChildren();
}
function setLanguage(code) {
  locale = code;
  document.documentElement.lang = languages.find(
    (lang) => lang.code === code,
  ).tag;
  document.documentElement.dir = code === "he" ? "rtl" : "ltr";
  document.title = t(code, "appName");
}
function header({ parent = true } = {}) {
  const bar = node("header", "topbar"),
    brand = node("div", "brand");
  brand.innerHTML = '<span class="brand-mark" aria-hidden="true">✦</span>';
  brand.append(node("span", "brand-name", t(locale, "appName")));
  bar.append(brand);
  if (parent) {
    const gate = button("parent-gate", "", parents.showGate);
    gate.setAttribute("aria-label", t(locale, "parent"));
    gate.append(
      node("span", "", "⚙"),
      node("span", "menu-label", t(locale, "menu")),
    );
    bar.append(gate);
  }
  return bar;
}
function languagePicker() {
  clear();
  locale = null;
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
  document.title = "Little Language Quest";
  const screen = node("main", "screen launch-screen");
  screen.append(
    node("div", "launch-badge", "✦  ✿  ★"),
    node("h1", "launch-title", "Little Language Quest"),
    node(
      "p",
      "launch-subtitle",
      "Choose a language · Выбери язык · בְּחַר שָׂפָה",
    ),
  );
  const choices = node("div", "language-choices");
  for (const lang of languages) {
    const choice = button("language-choice", "", () => {
      setLanguage(lang.code);
      welcome();
    });
    choice.lang = lang.tag;
    choice.innerHTML = `<span class="language-sample" dir="${lang.code === "he" ? "rtl" : "ltr"}">${lang.flag}</span><span>${lang.name}</span><span class="choice-arrow" aria-hidden="true">↗</span>`;
    choices.append(choice);
  }
  screen.append(choices);
  app.append(screen);
}
function welcome() {
  clear();
  const screen = node("main", "screen welcome-screen");
  screen.append(header());
  const hero = node("section", "welcome-card");
  hero.innerHTML =
    '<div class="welcome-art" aria-hidden="true"><span>★</span><span>●</span><span>▲</span></div>';
  const welcomePortrait = createReaction("happy");
  welcomePortrait.element.classList.add("welcome-portrait");
  if (!welcomePortrait.element.hidden)
    hero.replaceChildren(welcomePortrait.element);
  hero.append(
    node("h1", "welcome-title", t(locale, "play")),
    button("primary-button play-button", t(locale, "play"), () => {
      audio.unlock().catch(() => {});
      startTask();
    }),
  );
  screen.append(
    hero,
    button("text-button", t(locale, "choose"), languagePicker),
  );
  if (!window.matchMedia("(display-mode: standalone)").matches) {
    screen.append(
      button(
        "secondary-button welcome-install",
        t(locale, "install"),
        installApp,
      ),
    );
  }
  app.append(screen);
}
function currentLevel(gameId) {
  return (
    levelOverride ||
    Math.min(
      3,
      1 + Math.floor((progress.skills[`${locale}:${gameId}`] || 0) / 8),
    )
  );
}
function starRail() {
  const stars = Math.floor(progress.correct / 5),
    rail = node("div", "star-rail");
  rail.setAttribute("aria-label", `${stars} ★`);
  for (let i = 0; i < 5; i++)
    rail.append(node("span", i < stars % 5 ? "filled" : "", "★"));
  rail.append(node("span", "star-count", String(stars)));
  const dots = node("span", "progress-dots");
  dots.setAttribute("aria-label", t(locale, "progress", progress.correct % 5));
  for (let i = 0; i < 5; i++)
    dots.append(node("i", i < progress.correct % 5 ? "filled" : ""));
  rail.append(dots);
  return rail;
}
function startTask({ gameId = null, seed = null, practice = false } = {}) {
  clear();
  lifetime = new TaskLifetime();
  const taskLife = lifetime;
  const selected = gameId
    ? nextTask(
        games.filter((game) => game.id === gameId),
        locale,
        currentLevel(gameId),
        [],
        seed ?? undefined,
      )
    : scheduler.next(games, locale, currentLevel);
  const { task } = selected;
  let complete = false,
    misses = 0;
  const screen = node("main", "screen game-screen");
  screen.append(header());
  const stage = node("section", "stage"),
    meta = node("div", "stage-meta"),
    actions = node("div", "stage-actions");
  meta.append(starRail());
  const replay = button("replay-button", "", () =>
    audio.speak(task.speech || task.prompt, locale),
  );
  replay.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3zM16 8q4 4 0 8m3-11q7 7 0 14"/></svg>';
  replay.append(node("span", "", t(locale, "speaker")));
  actions.append(
    replay,
    volumeControl(audio, locale, "game-volume", () =>
      audio.speak(task.speech || task.prompt, locale),
    ).element,
  );
  if (practice)
    actions.append(button("text-button", t(locale, "debug"), parents.showLab));
  meta.append(actions);
  stage.append(meta);
  const title = node("h1", "task-prompt", task.prompt);
  title.tabIndex = -1;
  const reaction = createReaction("thinking", { lifetime: taskLife });
  const questionRow = node("div", "question-row");
  questionRow.append(title, reaction.element);
  stage.append(questionRow);
  const audioStatus = node("div", "audio-status");
  audioStatus.setAttribute("role", "status");
  stage.append(audioStatus);
  audio.onStatus = (status) => {
    if (!taskLife.alive) return;
    const key = {
      loading: "audioLoading",
      speaking: "audioSpeaking",
      error: "audioError",
      muted: "audioMuted",
    }[status];
    audioStatus.textContent = key ? t(locale, key) : "";
    audioStatus.classList.toggle("audio-error", status === "error");
    replay.classList.toggle("speaking", status === "speaking");
  };
  const field = node("div", "task-field"),
    feedback = node("div", "feedback");
  feedback.setAttribute("aria-live", "polite");
  stage.append(field, feedback);
  const api = {
    locale,
    audio,
    isComplete: () => complete || !taskLife.alive,
    later: (fn, delay) => taskLife.later(fn, delay),
    encourage() {
      if (!complete && taskLife.alive) {
        reaction.set("happy", 2400);
        feedback.textContent = t(locale, "good");
        feedback.className = "feedback success";
      }
    },
    wrong(element) {
      if (complete || !taskLife.alive) return;
      misses++;
      reaction.set(misses % 2 ? "sad" : "oops", 2400);
      audio.effect("wrong");
      feedback.textContent = t(locale, "try");
      feedback.className = "feedback retry";
      if (element) {
        element.classList.remove("wiggle");
        void element.offsetWidth;
        element.classList.add("wiggle");
      }
    },
    complete() {
      if (complete || !taskLife.alive) return;
      complete = true;
      reaction.set("happy");
      audio.effect("right");
      for (const control of field.querySelectorAll("button"))
        control.disabled = true;
      feedback.textContent = t(locale, "good");
      feedback.className = "feedback success";
      if (practice) {
        stage.append(
          button(
            "primary-button next-button",
            t(locale, "debug"),
            parents.showLab,
          ),
        );
        return;
      }
      const result = award(progress, locale, selected.game.id, misses);
      progress = result.progress;
      meta.replaceChild(starRail(), meta.firstChild);
      if (result.star)
        feedback.textContent = `${t(locale, "good")} ★ ${t(locale, "star")}`;
      if (result.star) reaction.set(result.celebrate ? "celebrating" : "surprised");
      stage.append(
        button("primary-button next-button", t(locale, "next"), () =>
          result.star ? showReward(stage, result.celebrate) : startTask(),
        ),
      );
    },
  };
  task.render(field, api);
  screen.append(stage);
  app.append(screen);
  window.scrollTo(0, 0);
  title.focus({ preventScroll: true });
  void audio.speak(task.speech || task.prompt, locale);
}
function showReward(stage, celebrate) {
  audio.stop();
  audio.effect("star");
  const overlay = node(
    "div",
    `reward-overlay ${celebrate ? "celebration" : ""}`,
  );
  overlay.setAttribute("role", "region");
  overlay.setAttribute("aria-label", t(locale, celebrate ? "party" : "star"));
  overlay.innerHTML =
    '<div class="reward-confetti" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="reward-star" aria-hidden="true">★</div>';
  const rewardPortrait = createReaction(celebrate ? "celebrating" : "surprised");
  rewardPortrait.element.classList.add("reward-portrait");
  if (!rewardPortrait.element.hidden) overlay.classList.add("has-portrait");
  overlay.append(rewardPortrait.element);
  overlay.append(
    node("h2", "reward-title", t(locale, celebrate ? "party" : "star")),
  );
  const next = button("primary-button", t(locale, "next"), () => startTask());
  overlay.append(next);
  for (const child of stage.children) child.inert = true;
  stage.append(overlay);
  next.focus();
}
function panelShell(title) {
  clear();
  const screen = node("main", "screen parent-screen");
  screen.append(header({ parent: false }));
  const panel = node("section", "parent-panel"),
    top = node("div", "panel-heading");
  top.append(
    node("h1", "", title),
    button("secondary-button", t(locale, "back"), welcome),
  );
  panel.append(top);
  screen.append(panel);
  app.append(screen);
  return panel;
}
async function installApp() {
  if (window.matchMedia("(display-mode: standalone)").matches)
    return alert(t(locale, "installDone"));
  if (installPrompt) {
    const event = installPrompt;
    installPrompt = null;
    await event.prompt();
  } else alert(t(locale, "installHelp"));
}
document.addEventListener("keydown", (event) => {
  if (
    locale &&
    event.altKey &&
    event.shiftKey &&
    event.key.toLowerCase() === "p"
  )
    parents.showGate();
});
languagePicker();
