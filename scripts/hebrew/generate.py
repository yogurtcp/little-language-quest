"""Compatibility entry point for the selected Google Kore Hebrew voice.
See scripts/HEBREW_KORE.md for credentials and build instructions.
Historical Hila generation remains in Git history.
"""
from pathlib import Path
import runpy

if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).resolve().parents[1] / 'generate-hebrew-kore.py'), run_name='__main__')
