# Little Language Quest

[Play the game](https://yogurtcp.github.io/little-language-quest/)

A browser game for young children, with a Russian, Hebrew, or English choice on every launch. The child-facing game stays in that language. No account, tracking, ads, API keys, or runtime dependencies.

- 12 independent activities: starting letters, counting, word/picture memory, letter order, first letters, clues, addition/subtraction, comparison, listening, missing numbers, making amounts, and patterns.
- 86 original SVG illustrations and independently localized words; 50 clues with explicit correct and incorrect choice pools.
- 612 active narration clips, downloaded only as needed. Instructions play automatically after Play; the speaker button repeats them. A saved volume slider on each task and in the adult menu adjusts speech and effects from silent to 250% with peak limiting. All picture choices pronounce the chosen word, including mistakes. Correct pictures also reveal the complete word; questions do not reveal the pictured answer in writing.
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

Tests exercise completing all 12 games in three languages and three levels, including mistakes, revealed labels, memory reset, content cycles, audio coverage, playback without system voices, canceled speech, canceled timers, and rewards.

## Adult menu

**Tap the Menu / gear button**, then answer the adult arithmetic check (12 + 7). Keyboard shortcut: Alt+Shift+P. Escape closes the check; the native dialog manages keyboard focus.

Settings include language, sound, level, voice test, app installation, offline audio downloads, progress reset, and the Game Lab. Choose any activity and a task number in the lab for a reproducible question.

## Narration and Hebrew

MP3s are generated at development time with Russian Svetlana and English Aria voices. Hebrew uses Piper with an explicit pronunciation dictionary containing vowels and stress for every pointed word. Hebrew display text retains niqqud. Letter instructions use explicit letter names; abstract math uses feminine Hebrew number names. Hebrew never falls back to system voices that may ignore niqqud. Russian and English can use a same-language fallback. Failed playback produces a visible message and a retry button. Compound questions trim clip padding and schedule short gaps between spoken segments.

The Hebrew voice resource has a non-commercial license. See [Hebrew sources, pronunciation dictionary, and rebuild instructions](scripts/hebrew/SOURCES.md).

The audio is synthesized, not a human recording. Linguistic text is curated, but the clips have not had a native-speaker listening review. The parent voice test and Game Lab support that review.

To regenerate changed text:

```sh
python3 -m pip install edge-tts==7.2.8
python3 scripts/generate-audio.py
```

The Russian/English generator sends only authored game text to the speech service at build time. Hebrew recordings are generated locally, using the separate instructions above. The shipped app loads its own static audio files from GitHub Pages. Hashed filenames reuse unchanged clips; commit the manifest and clips together.

## Installation, offline play, and updates

After choosing a language, tap **Install app** on the welcome screen. On Android Chrome this opens the system install prompt when available. Launch the resulting **Language Quest** icon from the app drawer or home screen to use the standalone view without Chrome's address bar. If Chrome only creates a browser shortcut, remove it and use Chrome's **Add to Home Screen → Install app** command instead. The install control is also in the adult menu. On iPhone/iPad, use Safari's Share menu and **Add to Home Screen**.

The service worker caches the application shell; heard clips are cached as well. Before fully offline play, use **Download audio for offline play** for the chosen language and wait for completion. Each language is roughly 3–4 MiB. Installation is browser dependent; local Python previews intentionally skip service-worker registration.

A release caches a complete module graph. Existing installations reload once when a new worker takes control. Progress is preserved. Cache cleanup is limited to this app's own caches, since other GitHub Pages apps share the same origin.

## Code map

- `src/games/`: each activity creates a task and renders only its own board.
- `src/games/shared.js`: picture cards, word reveal, number choices, small DOM helpers.
- `src/core/content.js`, `clues.js`, `art.js`, `extra-art.js`: vocabulary, reviewed clue pools, lightweight illustrations.
- `src/core/scheduler.js`: activity rotation, content history, reproducible lab generation.
- `src/core/speech.js`, `audio.js`, `audio-manifest.js`: finite narration catalog, cancellable playback, clip mapping.
- `src/core/lifecycle.js`, `rewards.js`, `storage.js`: task cleanup, progression, resilient local storage.
- `src/ui/parents.js`: adult check, settings, installation controls, and lab.
- `src/main.js`: screen navigation and task orchestration.

Tasks expose answer metadata for tests; it is not rendered to children. A task receives `locale`, `level`, `rng`, and a `choose` content-deck function. Its UI receives a completion callback, retry feedback, audio, and cancellable timers. New games should use `api.later()` rather than unmanaged timeouts.

See [BUILD_PLAN.md](BUILD_PLAN.md) for the initial product plan.
