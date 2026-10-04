# Hebrew pronunciation recordings

Every pointed Hebrew token in the game's narration has an explicit IPA entry in
`pronunciations.json`. Lookup includes niqqud and fails for unknown spellings.
`recordings.json` records the complete IPA input and model checksum for each clip.
For example, שְׁמוֹנֶה and שְׁמוֹנָה have different final vowels and stress.
A native-speaker listening review is still needed; explicit phonemes make any
correction reproducible without relying on browser pronunciation guesses.

## Rebuild

Install build tools (not app dependencies):

```sh
python3 -m pip install piper-tts==1.8.0 soundfile==0.14.0 imageio-ffmpeg==0.6.0
```

Download `he_IL-saspeech-medium.onnx` and its `.onnx.json` configuration from the
[official Piper voice repository](https://huggingface.co/rhasspy/piper-voices/tree/main/he/he_IL/saspeech/medium)
to a directory outside this repository. Then run:

```sh
python3 scripts/hebrew/generate.py --model /path/to/he_IL-saspeech-medium.onnx
python3 scripts/generate-audio.py
```

Only MP3s ship in the app. The model, Python packages, and inference engine do not.
The generator supplies authored phonemes directly, bypassing automatic Hebrew
text-to-phoneme conversion. Unchanged content hashes reuse existing recordings.
Old recording URLs are maintained through `scripts/audio-aliases.json` for
previously installed app versions.

## Attribution and use

The Hebrew voice uses Piper's SASPEECH model, trained on the
[SASPEECH dataset](https://www.openslr.org/134/) (Orian Sharoni, Roee Shenberg,
and Erica Cooper, Interspeech 2023). Dataset recordings feature Shaul
Amsterdamski; copyright in those recordings and transcripts belongs to the
Israeli Public Broadcasting Corporation (IPBC).

SASPEECH has a custom **non-commercial** license: no commercial, broadcast, or
political uses, unlawful uses, harm to the speaker/IPBC, or implication of IPBC
endorsement. See the dataset page and its linked Hebrew license for full terms.
This app uses it for free family education. These restrictions concern this
voice resource; they do not change the license of unrelated application code.
The synthesized game narration is not a recording of the speaker saying these
lines, and neither the speaker nor IPBC endorses this app.
