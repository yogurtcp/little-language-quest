"""Compatibility entry point for the approved free local female Hebrew voice.
See scripts/FREE_HEBREW_VOICES.md for the local model setup and CLI arguments.
"""
from pathlib import Path
import runpy
if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).resolve().parents[1] / 'generate-hebrew-blue.py'), run_name='__main__')
