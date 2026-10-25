# Little Language Quest

[Play the game](https://yogurtcp.github.io/little-language-quest/)

A browser game for young children, with a Spanish, Russian, Hebrew, English, Mandarin Chinese, Japanese, Arabic, or Turkish choice on every launch. The child-facing game stays in that language. No account, tracking, ads, API keys, or runtime dependencies.

- 12 independent activities: starting letters, counting, word/picture memory, letter order, first letters, clues, addition/subtraction, comparison, listening, missing numbers, making amounts, and patterns.
- 86 generated pixel art illustrations and independently localized words; 50 clues with explicit correct and incorrect choice pools.
- 1,678 active narration clips, downloaded only as needed. Instructions play automatically after Play; the speaker button repeats them. A saved volume slider on each task and in the adult menu adjusts speech and effects from silent to 250% with peak limiting. All picture choices pronounce the chosen word, including mistakes. Correct pictures also reveal the complete word; questions do not reveal the pictured answer in writing.
- One of each activity per shuffled round. Separate content decks cycle through clues, listening words, letters, and math examples before repeating, and are remembered per language.
- Five completed tasks earn a star; five stars unlock a celebration. Mistakes never take stars away. Difficulty advances separately after eight unassisted completions of each skill.
- Completed answers stay visible until Next. Lab tasks do not award stars or change content decks.

## Run and test

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000>. There is no application build step. Node 18+ is needed only for developer tests:

```sh
npm ci
npm test
```

Tests exercise completing all 12 games in eight languages and three levels, including mistakes, revealed labels, memory reset, content cycles, audio coverage, playback without system voices, canceled speech, canceled timers, and rewards.

## Change language during play

Tap the **🌐 language button** beside Menu, then choose a language. A fresh question
starts immediately in that language; earned stars and saved progress are kept.
There is no adult arithmetic check for changing languages. The picker order is
Spanish, Russian, Hebrew, English, Chinese, Japanese, Arabic, Turkish.

## Spanish

Spanish uses vocabulary and Elvira recordings from Spain, with the modern 27-letter
alphabet. Initial-letter matching removes vowel accents while retaining `Ñ` as a
separate letter. All 12 games, 86 picture words, and 50 clues are localized in
`src/locales/es.js`.

## Arabic and Turkish

Arabic uses Modern Standard Arabic, vowel-marked picture words, and a right-to-left
interface and letter-order answer line. Opening alif variants share the base alif
in letter tasks. Turkish uses the native 29-letter alphabet, including distinct
`I` and `İ`, and its own localized vocabulary and clues. Both languages include
all 12 games, 86 picture words, 50 clues, and downloadable recorded narration.
Arabic recordings use Zariyah and Turkish recordings use Emel. As with the other
languages, a native-speaker listening review is recommended.

`src/locales/ar.js` and `src/locales/tr.js` own the translations and literacy data.

## Adult menu

**Tap the Menu / gear button**, then answer the adult arithmetic check (12 + 7). Keyboard shortcut: Alt+Shift+P. Escape closes the check; the native dialog manages keyboard focus.

Settings include language, sound, level, voice test, app installation, offline audio downloads, progress reset, and the Game Lab. Hebrew also has a saved choice between Hila recordings and the device's Hebrew voice. If no Hebrew device voice is available, the recorded voice plays. Choose any activity and a task number in the lab for a reproducible question.

## Chinese and Japanese

All eight languages appear with flags on launch and in the parent language selector.
Chinese uses **Simplified Chinese and Mandarin**. Revealed words and memory word
cards include tone-marked pinyin. Starting-sound games use pinyin units, keeping
`zh`, `ch`, and `sh` intact. Ordering follows familiar pinyin teaching rows.
Japanese uses **hiragana for preschool reading**, including hiragana spellings of
loanwords. Speech uses conventional Japanese spellings to disambiguate readings.
Ordering follows hiragana rows; first-character tasks retain voiced kana such as `ば`.
Counting recordings use Mandarin `两` with classifiers and Japanese counters such
as `いっこ`, `ろっこ`, and `はっこ`, while arithmetic uses standalone numbers.

`src/locales/zh.js` and `src/locales/ja.js` each own their vocabulary, 50 clues,
UI translations, literacy rules, and speech data. All 86 pictures are reused.
Narration is generated once using Xiaoxiao (`zh-CN-XiaoxiaoNeural`) and Nanami
(`ja-JP-NanamiNeural`); the app serves the MP3s itself. Native-speaker listening
review of these new recordings is still recommended, especially letter prompts.

References: [Mandarin pinyin scheme](https://www.moe.gov.cn/jyb_sjzl/ziliao/A19/195802/t19580201_186000.html),
[Microsoft supported voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts).

## Object artwork

All 86 vocabulary pictures use cute pixel art, shared across all games and languages.
Six transparent WebP atlases total about 680 KiB and are cached for offline play.
Use **All pictures** in the adult menu to review the complete localized collection.
The counting circles remain simple geometric shapes.

`scripts/build-pixel-art.cjs` normalizes generated 4×4 PNG sheets into compact atlases.
It requires the build-only `sharp` package; the browser has no image-processing dependency.
Rebuild with `node scripts/build-pixel-art.cjs <sheet-name> <source.png>`.

## Portrait reactions

Six realistic transparent portrait stickers react to new questions, correct choices, retries,
and star rewards. Mistakes alternate sad and oops expressions. Each expression
stays enlarged for two seconds before gently settling. The parent menu has a Picture buddy switch and a reaction gallery.
Reaction reset timers belong to the current task and cannot replace a newer success.
The six 384px WebP files in `assets/reactions/` total about 150 KiB and are included
in the offline shell. The original family photo is not included in the repository.

## Narration and Hebrew

MP3s are generated at development time with Russian Svetlana, English Aria, and
Hebrew Hila, Mandarin Xiaoxiao, Japanese Nanami, Arabic Zariyah, Turkish Emel, and Spanish Elvira neural voices. Hebrew narration uses explicit unpointed speech
spellings while display text retains niqqud. Hila is the default, including for
installations that previously selected a device voice. The device voice remains
an optional parent setting. The owner approved a short Hila sample; the complete
catalog still needs a native-speaker listening review in the Game Lab.

See [Hebrew voice sources and rebuild instructions](scripts/hebrew/SOURCES.md).
Letter instructions use explicit letter names. Failed playback produces a visible
retry message. Compound questions trim clip padding and use short gaps.

To regenerate changed text:

```sh
python3 -m pip install edge-tts==7.3.1
python3 scripts/generate-audio.py
```

The Russian/English/Mandarin/Japanese/Arabic/Turkish/Spanish generator sends only authored game text to the speech service at build time. Hebrew recordings use the separate generation script above and the same online speech service. The shipped app loads its own static audio files from GitHub Pages. Hashed filenames reuse unchanged clips; commit the manifest and clips together.

## Installation, offline play, and updates

After choosing a language, tap **Install app** on the welcome screen. On Android Chrome this opens the system install prompt when available. Launch the resulting **Language Quest** icon from the app drawer or home screen to use the standalone view without Chrome's address bar. If Chrome only creates a browser shortcut, remove it and use Chrome's **Add to Home Screen → Install app** command instead. The install control is also in the adult menu. On iPhone/iPad, use Safari's Share menu and **Add to Home Screen**.

The service worker caches the application shell; heard clips are cached as well. Before fully offline play, use **Download audio for offline play** for the chosen language and wait for completion. Each language is roughly 3–4 MiB. Installation is browser dependent; local Python previews intentionally skip service-worker registration.

A release caches a complete module graph. Online startups check for updates once; the app does not poll or check on foreground return or reconnection. An idle app applies an available release once. An active question stays visible until the next navigation boundary, then the app applies the update and resumes in the chosen language. Stars, settings, and downloaded audio are preserved. Updates cannot run while the app is closed. The parent menu has **Update game**, which opens an independent
[recovery page](https://yogurtcp.github.io/little-language-quest/update.html) for stuck installations.
It reinstalls only this app’s shell, reports the installed version, and keeps stars, settings, and audio.
Transient installation failures are retried before activation. Cache cleanup is limited to this app's own caches, since other GitHub Pages apps share the same origin.

## Code map

- `src/games/`: each activity creates a task and renders only its own board.
- `src/games/shared.js`: picture cards, word reveal, number choices, small DOM helpers.
- `src/core/content.js`, `clues.js`, `art.js`, `pixel-art.js`: vocabulary, reviewed clue pools, shared pixel artwork.
- `src/core/scheduler.js`: activity rotation, content history, reproducible lab generation.
- `src/core/speech.js`, `audio.js`, `audio-manifest.js`: finite narration catalog, cancellable playback, clip mapping.
- `src/core/lifecycle.js`, `rewards.js`, `storage.js`: task cleanup, progression, resilient local storage.
- `src/ui/parents.js`: adult check, settings, installation controls, and lab.
- `src/main.js`: screen navigation and task orchestration.

Tasks expose answer metadata for tests; it is not rendered to children. A task receives `locale`, `level`, `rng`, and a `choose` content-deck function. Its UI receives a completion callback, retry feedback, audio, and cancellable timers. New games should use `api.later()` rather than unmanaged timeouts.

See [BUILD_PLAN.md](BUILD_PLAN.md) for the initial product plan.

## Selected Hebrew voice upgrade

Kore is the selected replacement for Hebrew narration. The build-time migration
and credential setup are documented in [HEBREW_KORE.md](scripts/HEBREW_KORE.md).
The published voice changes only when the replacement audio is generated and released.
