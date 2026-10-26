// New narration and locale modules are part of each complete offline release.
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {audioManifest} from '../src/core/audio-manifest.js';
const root = new URL('../', import.meta.url), worker = new URL('sw.js', root);
let source = readFileSync(worker, 'utf8');
const corePattern = /const CORE = (\[[\s\S]*?\]);/;
const existing = JSON.parse(source.match(corePattern)[1].replace(/,\s*\]$/, ']'));
const voiceRelease = JSON.parse(readFileSync(new URL('scripts/hebrew/blue-recordings.json', root)));
const core = [...new Set([...existing.filter(path => !path.startsWith('./audio/he/') && !path.startsWith('./audio/fil/')), './assets/hebrew-voice/NOTICE.md', './src/locales/fil.js',
  ...[...Object.values(audioManifest.he), ...Object.values(audioManifest.fil || {}), ...voiceRelease.previousPaths].map(path => './' + path)])];
const template = source.replace(/const VERSION = "[^"]+";/, 'const VERSION = "__BUILD__";')
  .replace(corePattern, 'const CORE = [];');
const hash = createHash('sha256').update(template);
for (const path of core) hash.update(path).update(readFileSync(new URL(path === './' ? 'index.html' : path, root)));
const version = 'little-language-quest-shell-' + hash.digest('hex').slice(0, 12);
source = source.replace(/const VERSION = "[^"]+";/, `const VERSION = ${JSON.stringify(version)};`)
  .replace(corePattern, 'const CORE = ' + JSON.stringify(core, null, 2) + ';');
writeFileSync(worker, source);
console.log(`Prepared ${version}: ${Object.keys(audioManifest.he).length} Hebrew and ${Object.keys(audioManifest.fil || {}).length} Filipino recordings bundled.`);
