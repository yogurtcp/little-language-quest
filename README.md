# Little Language Quest

[Play the game](https://yogurtcp.github.io/little-language-quest/)

A browser game for young children, with a Russian, Hebrew, or English choice on every launch. The child-facing game stays in that language. No account, tracking, ads, API keys, or runtime dependencies.

- 12 independent activities: starting letters, counting, word/picture memory, letter order, first letters, clues, addition/subtraction, comparison, listening, missing numbers, making amounts, and patterns.
- 86 original SVG illustrations and independently localized words; 50 clues with explicit correct and incorrect choice pools.
- 612 bundled narration clips (9.6 MiB across all three languages), downloaded only as needed. Instructions play automatically after Play; the speaker button repeats them. Correct pictures reveal and pronounce the complete word.
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

MP3s are generated at development time with Russian Svetlana, Hebrew Hila, and English Aria neural voices. Hebrew display and narration source text retain niqqud. Letter instructions use explicit letter names; abstract math uses feminine Hebrew number names. System speech is only a same-language fallback if a recording cannot load. Failed playback produces a visible message and a retry button.

The audio is synthesized, not a human recording. Linguistic text is curated, but the clips have not had a native-speaker listening review. The parent voice test and Game Lab support that review.

To regenerate changed text:

```sh
python3 -m pip install edge-tts==7.2.8
python3 scripts/generate-audio.py
```

The generator sends only the authored game text to the speech service at build time. The shipped app loads its own static audio files from GitHub Pages. Hashed filenames reuse unchanged clips; commit the manifest and clips together.

## Installation, offline play, and updates

Use **Install app** in the parent menu. If the browser does not offer an install dialog, use its **Add to Home Screen** command (on iPhone/iPad, Safari's Share menu).

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
