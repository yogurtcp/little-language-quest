"""Generate bundled Hebrew narration with Microsoft's Hila neural voice.
Build dependency: edge-tts==7.2.8. Sends only authored game text, using explicit unpointed spellings; display text retains niqqud.
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

ROOT = pathlib.Path(__file__).resolve().parents[2]
VOICE = 'he-IL-HilaNeural'
RATE = '+0%'

async def main():
    catalog = json.loads(subprocess.check_output(['node', 'scripts/audio-catalog.js'], cwd=ROOT))['he']
    record_path = ROOT / 'scripts/hebrew/recordings.json'
    previous = json.loads(record_path.read_text())['records']
    lexicon = json.loads((ROOT / 'scripts/hebrew/speech-text.json').read_text())
    records = {}
    gate = asyncio.Semaphore(3)
    completed = 0

    async def generate(text):
        nonlocal completed
        spoken = re.sub(r'[\u0590-\u05ff]+', lambda match: lexicon[match.group()], unicodedata.normalize('NFC', text))
        digest = hashlib.sha256(('he-neural-plain-v1\n' + VOICE + '\n' + RATE + '\n' + text + '\n' + spoken).encode()).hexdigest()[:16]
        relative = f'audio/he/{digest}.mp3'
        path = ROOT / relative
        async with gate:
            if not path.exists() or path.stat().st_size < 1000:
                for attempt in range(5):
                    try:
                        temporary = path.with_suffix('.tmp')
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
