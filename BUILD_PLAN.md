# Little Language Quest — build plan

## Goal and first release

Build a small browser game for a four-year-old. On launch, the child chooses Russian, Hebrew, or English. From that point, every child-facing instruction, word, button, success message, and spoken prompt uses only that language. The parent area can change the language. A play session is a series of short tasks chosen from several game types, with no timer or penalty for mistakes.

The app will be a static, installable Progressive Web App (PWA). It will work on a phone, tablet, or desktop through a URL, and after the first complete load it will work offline. The code will use plain JavaScript modules, HTML, CSS, SVG, and browser audio APIs. There is no account, server, tracking, ad, or runtime network service.

## Child experience

1. **Language launch screen:** three large, clearly labeled choices: Русский, עִבְרִית, English. Remember the last choice for next time, but let the child choose again. Country flags are not used as language symbols.
2. **Start gesture:** one large Play button unlocks browser audio. Then a spoken, written instruction introduces the first task.
3. **Task screen:** one instruction at the top, a speaker button to replay it, a central area with two to six large visual choices, and a small star rail. Tap targets are at least 64 CSS pixels. Answers respond immediately; after a wrong tap, a gentle sound and a hint invite another try. No score is lost.
4. **Task completion:** a small success animation and chime, then an automatic transition after a short pause. The child can tap “next” sooner.
5. **Milestones:** every five completed tasks earns one star. Every fifth star triggers a short, skippable celebration. Earned stars and celebrations are saved on the device. A mistake never resets progress.

## Activities and task rules

| ID | Activity | Example and interaction | Generation rule |
| --- | --- | --- | --- |
| `initialSet` | Tap every picture beginning with a sound/letter | Russian **С**: собака, сок, сосиска among distractors | Use language-specific, reviewed word metadata; include 2–3 correct and 2–3 distractors. Complete after all correct cards are tapped. |
| `countGroup` | Find the group with N shapes or objects | “Where are five circles?” among groups of 3, 5, and 6 | Use 1–10 items, with distinct group counts; early level 1–5. Draw objects in a stable grid so there is no ambiguous overlap. |
| `memoryPairs` | Match a written word to a picture | Flip two cards; match “собака” with a dog | Start with 2 pairs, advance to 3 or 4. A task completes when all pairs are matched. Speak the revealed word. |
| `letterOrder` | Put letters in alphabet order | Tap А, Б, В in order from shuffled tiles | Start with 3 consecutive familiar letters. Hebrew sequence lays out right to left; final forms and Russian ъ/ь are later content. |
| `firstLetter` | Choose the first letter of a pictured object | Dog appears; choose **С** for “собака” in Russian | The object name is spoken. Show 3–4 letters; distractors must be visibly and audibly distinct. |
| `describe` | Choose by attribute or sound | “Who says woof?”, “What is red?”, “What is sweet?” | Use explicit reviewed attributes; avoid culturally or contextually ambiguous answers. For one-answer prompts, exactly one shown card must match. |
| `arithmetic` | Solve addition or subtraction | 2 + 4 = ? Choose 6 | Early range 0–5, later 0–10. No negative result. Show concrete counters beside the equation when useful. |
| `compare` | Compare two quantities | 6 ? 7, choose < | Start with unequal groups and numbers, introduce = later. Give a visual size/quantity cue, not just the symbols. |
| `listenChoose` | Hear a word and choose its image | Spoken word with 3–4 pictures | Same curated vocabulary; useful before reading becomes comfortable. |
| `missingNumber` | Fill a gap in a number sequence | 2, 3, ?, 5 | Ascending by one, then descending; early range 0–5. |
| `makeAmount` | Add or remove objects to reach a target | “Make four stars” from two | Tapping adds/removes large counters; reinforces addition and subtraction physically. |
| `patternNext` | Continue a color or shape pattern | Red, blue, red, blue, ? | Start with AB patterns; later AAB. Use shapes as well as color so meaning is not color-only. |

The first eight activities are the core release. The last four are small extensions using the same game contract. The scheduler may use all available activities once their content and audio pass validation. It avoids repeating a game type immediately and avoids showing the same item or prompt too often. Tasks grow gradually more difficult, but the parent can lock a difficulty level.

## Language and pronunciation

- Each vocabulary item has a stable concept ID and separate Russian, Hebrew, and English entries. The visual refers to the concept, not to an English filename or translated string.
- Hebrew words and child-facing sentences are written with **niqqud** in the curated content. The displayed first letter, its name/sound, and its activity grouping are explicit fields; the game does not guess them by taking the first code unit of a string. This avoids errors with combining marks, Hebrew final letters, and words whose spelling/sound needs judgment.
- All vocabulary, prompts, and answer options receive a native-speaker review, especially Hebrew pronunciation and niqqud. Audio is stored by locale and semantic key. Use short, compressed, locally hosted voice clips for the fixed words and instruction templates, plus recorded numbers and operators for composed math prompts. A native speaker checks the final assembled examples, not just each clip in isolation.
- Browser text-to-speech is an **optional parent-controlled fallback** during development, because the available voices depend on the device and a Hebrew voice cannot be assumed. A missing reviewed clip is a content validation failure for release. The fallback never silently substitutes another language.
- Set `lang` on the active screen and `dir="rtl"` for Hebrew text regions. Keep equations, comparison signs, counters, and left/right positional instructions in explicitly controlled layout containers so RTL does not reverse mathematical meaning. Test niqqud rendering on the target devices.
- Do not generate tasks by translating a Russian word list. For example, an initial-letter task gets its eligible concepts separately for each language; the same three pictures need not be selected in every language.

## Small content model

```js
const concepts = {
  dog: {
    art: "dog",
    facts: ["animal", "saysWoof"],
    words: {
      ru: { display: "собака", initial: "С", audio: "ru/word/dog.opus" },
      he: { display: "כֶּלֶב", initial: "כ", audio: "he/word/dog.opus" },
      en: { display: "dog", initial: "D", audio: "en/word/dog.opus" }
    }
  }
};
```

Content validation checks: required locale strings and audio exist; no duplicate answer IDs; exactly one answer for single-choice tasks; correct/distractor counts are feasible; math answers stay in range; all task text is in the active locale; every image has a spoken name. A reviewed content table, rather than a translation algorithm, determines eligible letter and attribute tasks.

## Code separation

```text
index.html
manifest.webmanifest
sw.js
src/
  main.js                  app startup and screen routing
  core/
    session.js             current locale, task state, transitions
    scheduler.js           difficulty, weighted random selection, repeat limits
    registry.js            game registration and shared interface
    rewards.js             stars and celebration thresholds
    audio.js               voice clips, effects, replay, mute
    storage.js             versioned local progress and settings
    contentValidation.js   checks all curated data
  games/
    initialSet.js
    countGroup.js
    memoryPairs.js
    letterOrder.js
    firstLetter.js
    describe.js
    arithmetic.js
    compare.js
    listenChoose.js
    missingNumber.js
    makeAmount.js
    patternNext.js
  content/
    concepts.js           picture IDs, word metadata, attributes
    prompts.ru.js
    prompts.he.js
    prompts.en.js
    curriculum.js         supported letters, number ranges, stages
  ui/
    shell.js              language picker, task shell, parent overlay
    components.js         cards, counters, letter tiles, speaker button
    styles.css
assets/
  art/                    small original SVG illustrations
  audio/{ru,he,en}/       reviewed compressed voice clips
  icons/                  PWA icons
tests/
  content.test.js
  scheduler.test.js
  gameRules.test.js
```

Each game module exports the same narrow interface. The shell owns navigation, audio playback, rewards, and persistence. Games own only their task-specific rules and UI data:

```js
export const initialSet = {
  id: "initialSet",
  canGenerate(content, locale, level) { /* boolean */ },
  create({ content, locale, level, rng }) { /* serializable task */ },
  view(task, state) { /* render description for shared components */ },
  reduce(task, state, action) {
    // { state, feedback: "correct" | "retry" | "hint", complete: boolean }
  }
};
```

The scheduler calls `canGenerate` before selecting a game, then `create` with a seeded random generator. It saves the seed and task ID for reproducible parent testing. `reduce` is a pure rule function, so activity logic can be tested without a browser. The shell awards progress once, only when a task first becomes complete. A debug task carries `practiceOnly: true`, so testing cannot mint stars.

## Visual direction

- A warm off-white background, deep ink text, and three or four bright accent colors (teal, coral, yellow, lavender). Rounded cards, soft shadows, clear outlines, and plenty of space. Avoid full-screen flashing or busy decoration.
- Original, simple SVG illustrations with consistent outlines and friendly faces where appropriate. Counting objects and shapes can be drawn directly by SVG/CSS. Avoid heavy image libraries, stock illustrations, or emoji as the only way to recognize an answer.
- One clear focal task per screen. Portrait tablets show a 2-column card grid; wider screens can use 3 columns. Text remains large and readable, including Hebrew niqqud. Feedback has sound, color, and motion cues together.
- Reduced-motion support makes celebrations static; mute and replay are always available. A wrong answer gets a short soft “try again” tone, not a harsh buzzer. A correct answer gets a bright two- or three-note chime. Synthesize these tiny effects with Web Audio after the initial Play gesture rather than shipping large sound files.

## Parent area

An unobtrusive corner control opens only after a roughly three-second press and a simple adult arithmetic prompt. This is a child-resistant entry, not a security boundary. The panel contains:

1. Language choice, mute/volume, difficulty, and reset progress.
2. **Install app**: show the browser install dialog where supported; otherwise show device-specific Add to Home Screen instructions. The installed app launches in standalone display mode.
3. **Game lab**: list every game type, launch any one directly, choose a seed and difficulty, regenerate a sample, replay every clip, and inspect content validation errors. Lab rounds never affect rewards or learning history.
4. An offline/audio readiness indicator, so the parent can see whether all voice clips for the selected locale are cached.

## Rewards and persistence

`completedTasks` advances only for a first-time successful completion in normal play. `stars = floor(completedTasks / 5)`. At stars 5, 10, 15, and so on, play a skippable 3–5 second celebration and remember that it has already been shown. Keep task/difficulty progress per language, while the star total is shared across languages. Save locally with a versioned storage key; provide a parent reset button. There is no streak loss and no attempt limit.

## Running, installing, and publishing

Keep the app dependency-free so it can be served locally with `python3 -m http.server 8000` and opened at `http://localhost:8000`. `file://` is not the target launch mode because PWA installation requires HTTPS or localhost. The repository README will give a one-command run path and install instructions.

Publish the static files through GitHub Pages under a new `yogurtcp` repository, provisionally named `little-language-quest`. Use relative asset URLs so a project Pages path works. The manifest supplies 192px and 512px icons and standalone display mode. A versioned service worker caches the app shell, SVGs, and reviewed audio for offline play; it removes obsolete caches on update. The parent area reports installation support and cached audio status. GitHub Pages can publish directly from the repo root or a Pages workflow; choose the simplest option compatible with the created repository.

## Build sequence and acceptance checks

1. Create the new GitHub repository and commit this plan and a concise README.
2. Build the shell, language choice, audio unlock/replay, content schema, seeded scheduler, rewards, and parent gate.
3. Implement the first eight games as separate modules. Add the four extension games after the shared contract and content checks are stable.
4. Create a compact, original SVG vocabulary set and counting graphics. Prepare and native-review Russian, Hebrew, and English clips, especially Hebrew niqqud and assembled prompts.
5. Add offline install support and GitHub Pages publishing.
6. Verify each activity through the parent lab in all three languages on desktop and a touch device. Check answer uniqueness, RTL math display, touch target sizes, wrong-answer recovery, audio replay, stars at tasks 5/10/25, offline reload, and installed launch. Run content/rule tests and inspect representative screenshots.

**Release gate:** all core activities can be launched individually and occur in normal play; every child-facing screen is in the chosen language; Hebrew text and audio have been reviewed by a fluent speaker; no task can be generated without a valid answer; audio works after Play and offline; five correct tasks earn a star and five stars trigger a celebration; the parent can install and debug the app.

## Technical references

- [MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [MDN: Trigger installation from your PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt)
- [MDN: Offline and background operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)
- [MDN: Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- [MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
- [GitHub: Configuring a Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
