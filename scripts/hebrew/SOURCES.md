# Hebrew narration

The current recordings use **Microsoft Hila Neural** (`he-IL-HilaNeural`), at its
normal speaking rate. The owner approved a sample of this voice with unpointed
speech input. A previous sample with niqqud in the TTS input was rejected.

The child still sees pointed Hebrew. `speech-text.json` maps every pointed token
to its unpointed speech spelling, including required full spellings such as
`עיגולים`, `מיטה`, and `תוף`. Simply deleting the vowel marks can produce a
different word; the generator fails if any token lacks a mapping.

`recordings.json` records the actual input and file path for each clip. Content
hashes include the voice, rate, display text, and spoken text. The app uses the
bundled clips by default; an optional device voice remains in the parent menu.
No runtime TTS account, API key, or external speech service is needed.

## Rebuild

```sh
python3 -m pip install edge-tts==7.2.8
python3 scripts/hebrew/generate.py
python3 scripts/generate-audio.py
```

The generator sends authored game text to Microsoft's online speech service.
Only the finished MP3 assets ship with the game. It updates old recording aliases
for existing installations; current clients use fresh filenames.

Microsoft documents Hila in its [supported voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts).
The build client is [edge-tts](https://github.com/rany2/edge-tts).

The sample has been reviewed by the owner; the complete catalog still needs a
native-speaker listening review. The Game Lab supports targeted review of all
activities. The old IPA dictionary remains as a pronunciation reference but is
not fed to the new engine. Earlier Piper/SASPEECH recordings and their provenance
remain available in Git history; current game narration no longer uses that model.
