import { node, button } from "../core/helpers.js";
import { languages, copy, t } from "../core/i18n.js";
import { downloadLanguage } from "../core/offline.js";
import { games } from "../games/index.js";
import { volumeControl } from "./volume.js";
export function createParentUI(app) {
  let gate = null,
    download = null;
  function showGate() {
    if (gate || !app.locale()) return;
    const locale = app.locale();
    app.audio.stop();
    const returnFocus = document.activeElement;
    gate = node("dialog", "parent-modal");
    gate.setAttribute("aria-labelledby", "gate-title");
    const title = node("h2", "", t(locale, "parentQuestion"));
    title.id = "gate-title";
    title.dir = "auto";
    const hint = node("p", "parent-note", t(locale, "parentHint"));
    hint.id = "gate-hint";
    const input = node("input", "parent-answer");
    input.type = "text";
    input.inputMode = "numeric";
    input.autocomplete = "off";
    input.pattern = "[0-9]*";
    input.setAttribute("aria-label", t(locale, "parentQuestion"));
    input.setAttribute("aria-describedby", "gate-hint");
    const note = node("p", "parent-note");
    note.setAttribute("aria-live", "polite");
    const close = () => {
      gate?.close();
      gate?.remove();
      gate = null;
      returnFocus?.focus();
    };
    const submit = () => {
      if (input.value.trim() === "19") {
        close();
        showMenu();
      } else {
        note.textContent = t(locale, "parentWrong");
        input.value = "";
        input.focus();
      }
    };
    const row = node("div", "modal-actions");
    row.append(
      button("secondary-button", t(locale, "back"), close),
      button("primary-button", "✓", submit),
    );
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") submit();
    });
    gate.addEventListener("cancel", (event) => {
      event.preventDefault();
      close();
    });
    gate.append(title, hint, input, note, row);
    document.body.append(gate);
    gate.showModal();
    input.focus();
  }
  function row(panel, label, control) {
    const wrapper = node("div", "setting-row"),
      text = node("label", "", label);
    control.id = `setting-${panel.querySelectorAll(".setting-row").length}`;
    text.htmlFor = control.id;
    wrapper.append(text, control);
    panel.append(wrapper);
  }
  function showMenu() {
    const locale = app.locale(),
      panel = app.panel(t(locale, "parentTitle"));
    const language = node("select", "setting-select");
    for (const lang of languages) {
      const option = node("option", "", lang.name);
      option.value = lang.code;
      option.selected = lang.code === locale;
      language.append(option);
    }
    language.addEventListener("change", () => {
      app.setLanguage(language.value);
      showMenu();
    });
    row(panel, t(locale, "choose"), language);
    const toggle = node("input");
    const volume = volumeControl(app.audio, locale, "parent-volume", () =>
      app.audio.speak(t(locale, "listenChoose"), locale),
    );
    toggle.type = "checkbox";
    toggle.checked = !app.audio.muted;
    toggle.addEventListener("change", () => {
      app.audio.setMuted(!toggle.checked);
      volume.sync();
    });
    volume.element.querySelector("input").addEventListener("input", () => {
      toggle.checked = !app.audio.muted;
    });
    row(panel, t(locale, "mute"), toggle);
    panel.append(volume.element);
    const level = node("select", "setting-select");
    for (const value of [0, 1, 2, 3]) {
      const option = node(
        "option",
        "",
        value === 0 ? t(locale, "auto") : copy[locale].level[value - 1],
      );
      option.value = value;
      option.selected = value === app.level();
      level.append(option);
    }
    level.addEventListener("change", () => app.setLevel(Number(level.value)));
    row(panel, t(locale, "difficulty"), level);
    const voice = node("div", "voice-panel");
    voice.append(node("span", "voice-ok", t(locale, "voiceReady")));
    const status = node("span", "audio-status");
    status.setAttribute("aria-live", "polite");
    voice.append(
      button("secondary-button", t(locale, "voiceTest"), () =>
        app.audio.speak(t(locale, "listenChoose"), locale),
      ),
      status,
    );
    panel.append(voice);
    app.audio.onStatus = (value) => {
      status.textContent =
        value === "error"
          ? t(locale, "audioError")
          : value === "speaking"
            ? t(locale, "audioSpeaking")
            : value === "muted"
              ? t(locale, "audioMuted")
              : "";
    };
    panel.append(button("wide-button", t(locale, "install"), app.install));
    const offline = button("wide-button", t(locale, "offline"), async () => {
      if (download) return;
      offline.disabled = true;
      download = downloadLanguage(locale, (done, total) => {
        offline.textContent = `${t(locale, "offlineBusy")} ${Math.round((done / total) * 100)}%`;
      });
      try {
        await download;
        offline.textContent = t(locale, "offlineReady");
      } catch {
        offline.textContent = t(locale, "offlineError");
        offline.disabled = false;
      } finally {
        download = null;
      }
    });
    panel.append(offline);
    panel.append(button("wide-button", t(locale, "debug"), showLab));
    panel.append(
      button("wide-button danger", t(locale, "reset"), () => {
        if (confirm(t(locale, "resetAsk"))) {
          app.reset();
          showMenu();
        }
      }),
    );
    panel.append(
      button("wide-button subtle", t(locale, "choose"), app.languagePicker),
    );
  }
  function showLab() {
    const locale = app.locale(),
      panel = app.panel(t(locale, "debug"));
    panel.append(node("p", "panel-note", t(locale, "debugHint")));
    const seedInput = node("input", "seed-input");
    seedInput.type = "number";
    seedInput.value = String(Math.floor(Math.random() * 100000));
    row(panel, t(locale, "seed"), seedInput);
    const list = node("div", "lab-grid");
    games.forEach((game, index) =>
      list.append(
        button(
          "lab-card",
          `${String(index + 1).padStart(2, "0")}  ${copy[locale].gameNames[game.id]}`,
          () =>
            app.startTask({
              gameId: game.id,
              seed: Number(seedInput.value),
              practice: true,
            }),
        ),
      ),
    );
    panel.append(list, button("secondary-button", t(locale, "menu"), showMenu));
  }
  return { showGate, showMenu, showLab };
}
