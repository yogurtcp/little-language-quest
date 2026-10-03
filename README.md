# Little Language Quest

A visual language and number game for young children. Choose Russian, Hebrew, or English on launch. The game includes 12 activity types, spoken prompts using the device's installed voices, soft answer sounds, stars, a parent game lab, and offline install support.

**Play:** <https://yogurtcp.github.io/little-language-quest/>

## Run locally

From this directory:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. No build step or package installation is required. For the content and task-generation checks, run `npm test` (Node 18 or newer).

## Parent menu

Hold the gear icon for about two seconds, then solve the arithmetic question. The parent menu has language, audio, difficulty, installation, reset, and a game lab. Lab tasks can be selected directly and do not earn stars.

## Speech and Hebrew

The app requests a voice matching `ru-RU`, `he-IL`, or `en-US` from the browser. The parent menu reports whether one is available. It does not substitute a voice from another language. Hebrew words and prompts display niqqud, with separate unpointed speech text for vocabulary. Speech synthesis quality depends on the installed device voice. A Hebrew-speaking adult should listen to the target device's voice before relying on it for pronunciation practice. Reviewed recorded clips are needed for guaranteed pronunciation and audio on devices without a Hebrew voice.

## Install and offline use

GitHub Pages serves the app over HTTPS. In supporting browsers, use Install app in the parent menu. On browsers without a programmable install prompt, use the browser's Add to Home Screen command. The service worker caches the static app files after the first load.

See [BUILD_PLAN.md](BUILD_PLAN.md) for the product and code design.
