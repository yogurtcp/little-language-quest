import { audioManifest } from "./audio-manifest.js";
export const AUDIO_CACHE = "little-language-quest-audio-v1";
export async function downloadLanguage(locale, onProgress = () => {}) {
  const cache = await caches.open(AUDIO_CACHE);
  const paths = Object.values(audioManifest[locale]);
  let done = 0;
  // Small batches keep the UI responsive and avoid hundreds of simultaneous requests.
  for (let i = 0; i < paths.length; i += 4)
    await Promise.all(
      paths.slice(i, i + 4).map(async (path) => {
        const url = new URL(`../../${path}`, import.meta.url).href;
        if (!(await cache.match(url))) {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
          await cache.put(url, response);
        }
        onProgress(++done, paths.length);
      }),
    );
}
