"""Render authored IPA pronunciations with Piper; no pronunciation guessing.
Build dependencies: piper-tts==1.8.0, soundfile==0.14.0, imageio-ffmpeg==0.6.0.
Pass --model /path/to/he_IL-saspeech-medium.onnx (see SOURCES.md).
Only compact MP3 recordings are shipped; the model stays outside the app.
"""
import argparse,hashlib,json,pathlib,re,subprocess,unicodedata
import numpy as np
import onnxruntime as ort
import soundfile as sf
import imageio_ffmpeg
from piper import PiperVoice, SynthesisConfig
ROOT=pathlib.Path(__file__).resolve().parents[2]
TOKEN=re.compile(r'[\u0590-\u05ff]+')
def phonemes(text,lexicon):
    # Lookup includes every vowel/dagesh/shin-dot. Do not strip niqqud or guess
    # a pronunciation for a newly introduced or differently pointed word.
    text=unicodedata.normalize('NFC',text)
    output=TOKEN.sub(lambda match:lexicon[match.group()],text)
    if TOKEN.search(output) or re.search(r'\d',output): raise ValueError(f'Unconverted text: {text}')
    return output.replace("\u0361", "")

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--model',required=True);args=parser.parse_args()
    lexicon=json.loads((ROOT/'scripts/hebrew/pronunciations.json').read_text())
    catalog=json.loads(subprocess.check_output(['node','scripts/audio-catalog.js'],cwd=ROOT))['he']
    model=pathlib.Path(args.model)
    model_hash=hashlib.sha256(model.read_bytes()).hexdigest()
    voice=PiperVoice.load(model)
    # CPU sessions are bounded, avoiding thread oversubscription during batch builds.
    options=ort.SessionOptions();options.intra_op_num_threads=2;options.inter_op_num_threads=1
    voice.session=ort.InferenceSession(str(model),sess_options=options,providers=['CPUExecutionProvider'])
    config=SynthesisConfig(length_scale=1.03,noise_scale=.5,noise_w_scale=.65)
    records={}
    for i,text in enumerate(catalog):
        ipa=phonemes(text,lexicon)
        unknown=set(ipa)-set(voice.config.phoneme_id_map)
        if unknown: raise ValueError(f'Unsupported phonemes: {unknown} in {text}')
        key=hashlib.sha256(('piper-he-v1\n'+model_hash+'\n'+text+'\n'+ipa).encode()).hexdigest()[:16]
        relative=f'audio/he/{key}.mp3';path=ROOT/relative
        if not path.exists():
            samples=voice.phoneme_ids_to_audio(voice.phonemes_to_ids(list(ipa)),config)
            samples=np.asarray(samples).flatten()
            if not len(samples) or float(np.max(np.abs(samples)))<.01: raise ValueError(f'Silent recording: {text}')
            peak=float(np.max(np.abs(samples)));samples=samples*(.88/peak)
            wav=path.with_suffix('.tmp.wav');sf.write(wav,samples,voice.config.sample_rate)
            subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','64k',str(path)],check=True)
            wav.unlink()
        records[text]={'ipa':ipa,'path':relative}
        if (i+1)%20==0: print(f'Hebrew: {i+1}/{len(catalog)}',flush=True)
    (ROOT/'scripts/hebrew/recordings.json').write_text(json.dumps({'engine':'Piper 1.8.0 / he_IL-saspeech-medium','model_sha256':model_hash,'records':records},ensure_ascii=False,indent=2)+'\n')
    print(f'Generated {len(records)} Hebrew recordings from explicit pronunciations',flush=True)
if __name__=='__main__': main()
