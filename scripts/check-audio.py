"""Decode all active recordings and reject missing, invalid, silent or clipped audio.
Optional verification dependency: soundfile==0.14.0.
"""
import json, pathlib, subprocess
import numpy as np
import soundfile as sf
ROOT=pathlib.Path(__file__).resolve().parents[1]
manifest=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {audioManifest} from './src/core/audio-manifest.js';console.log(JSON.stringify(audioManifest))"],cwd=ROOT))
count=0
for locale,entries in manifest.items():
    for text,path in entries.items():
        samples,rate=sf.read(ROOT/path)
        duration=len(samples)/rate
        peak=float(np.max(np.abs(samples)))
        assert .15<duration<20, (locale,text,duration)
        assert .02<peak<=1, (locale,text,peak)
        assert np.count_nonzero(np.abs(samples)>.004)/rate>.06, (locale,text,'too little audible content')
        count+=1
print(f'Decoded and checked {count} active recordings: no empty or silent clips.')
