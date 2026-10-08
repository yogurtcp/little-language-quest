"""Generate bundled Hebrew narration with Microsoft's Hila neural voice.
Build dependencies: edge-tts==7.2.8, soundfile==0.14.0.
Sends authored text with explicit unpointed spellings and optional pronunciation context;
display text retains niqqud.
The game plays these static MP3 files without a runtime speech service or API key.
"""
import asyncio
import hashlib
import json
import pathlib
import shutil
import subprocess
import re
import unicodedata
import edge_tts
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parents[2]
VOICE = 'he-IL-HilaNeural'
RATE = '+0%'

def extract_final_word(source, destination, metadata, expected):
    """Keep only the final word, using the engine's 100-nanosecond timestamps."""
    words = [event for event in metadata if event['type'] == 'WordBoundary']
    if len(words) < 2 or words[-1]['text'] != expected:
        raise ValueError(f'Missing final word boundary for {expected}')
    samples, sample_rate = sf.read(source)
    last = words[-1]
    start = round(last['offset'] / 10_000_000 * sample_rate)
    end = round((last['offset'] + last['duration']) / 10_000_000 * sample_rate)
    if not 0 < start < end <= len(samples):
        raise ValueError(f'Invalid word boundaries for {expected}')
    # Retain the natural word ending and trailing silence, with no later speech.
    sf.write(destination, samples[start:], sample_rate, format='MP3', subtype='MPEG_LAYER_III')

async def main():
    catalog = json.loads(subprocess.check_output(['node', 'scripts/audio-catalog.js'], cwd=ROOT))['he']
    record_path = ROOT / 'scripts/hebrew/recordings.json'
    previous = json.loads(record_path.read_text())['records']
    lexicon = json.loads((ROOT / 'scripts/hebrew/speech-text.json').read_text())
    overrides = json.loads((ROOT / 'scripts/hebrew/context.json').read_text())
    records = {}
    gate = asyncio.Semaphore(3)
    completed = 0

    async def generate(text):
        nonlocal completed
        spoken = re.sub(r'[\u0590-\u05ff]+', lambda match: lexicon[match.group()], unicodedata.normalize('NFC', text))
        context = overrides.get(text)
        recipe = 'he-neural-plain-v1\n' + VOICE + '\n' + RATE + '\n' + text + '\n' + spoken
        if context:
            if context['extractLastWord'] != spoken:
                raise ValueError(f'Context must extract the requested word: {text}')
            recipe += '\ncontext-final-word-v1\n' + context['input']
        digest = hashlib.sha256(recipe.encode()).hexdigest()[:16]
        relative = f'audio/he/{digest}.mp3'
        path = ROOT / relative
        async with gate:
            if not path.exists() or path.stat().st_size < 1000:
                for attempt in range(5):
                    try:
                        temporary = path.with_suffix('.tmp')
                        if context:
                            source = path.with_suffix('.source.mp3')
                            boundaries = path.with_suffix('.boundaries.jsonl')
                            try:
                                await asyncio.wait_for(edge_tts.Communicate(context['input'], VOICE, rate=RATE, boundary='WordBoundary').save(str(source), str(boundaries)), 40)
                                metadata = [json.loads(line) for line in boundaries.read_text().splitlines()]
                                extract_final_word(source, temporary, metadata, spoken)
                            finally:
                                source.unlink(missing_ok=True)
                                boundaries.unlink(missing_ok=True)
                        else:
                            await asyncio.wait_for(edge_tts.Communicate(spoken, VOICE, rate=RATE).save(str(temporary)), 40)
                        if temporary.stat().st_size < 1000:
                            raise ValueError(f'Empty recording: {text}')
                        temporary.replace(path)
                        break
                    except Exception:
                        if attempt == 4:
                            raise
                        await asyncio.sleep(2 ** attempt)
            records[text] = {'input': spoken, 'path': relative}
            if context:
                records[text].update({'input': context['input'], 'extractLastWord': spoken})
            completed += 1
            if completed % 20 == 0:
                print(f'Hebrew neural voice: {completed}/{len(catalog)}', flush=True)

    await asyncio.gather(*(generate(text) for text in catalog))
    # Preserve older app URLs while assigning fresh hashes to the new release.
    aliases_path = ROOT / 'scripts/audio-aliases.json'
    aliases = json.loads(aliases_path.read_text())
    replacements = {previous[text]['path']: records[text]['path'] for text in catalog if text in previous}
    aliases = {old: replacements.get(current, current) for old, current in aliases.items()}
    aliases.update({old: new for old, new in replacements.items() if old != new})
    for old, new in aliases.items():
        if old != new:
            shutil.copyfile(ROOT / new, ROOT / old)
    record_path.write_text(json.dumps({'engine': 'Microsoft neural TTS via edge-tts 7.2.8', 'voice': VOICE, 'rate': RATE, 'records': {text: records[text] for text in catalog}}, ensure_ascii=False, indent=2) + '\n')
    aliases_path.write_text(json.dumps(aliases, ensure_ascii=False, indent=2) + '\n')
    print(f'Finished {completed} Hebrew recordings.', flush=True)

if __name__ == '__main__':
    asyncio.run(main())
