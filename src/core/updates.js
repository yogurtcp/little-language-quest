// Check once at startup. Keep an active question on screen until its next navigation boundary.
export function watchUpdates({ canReload = () => true, beforeReload = () => {}, environment = globalThis } = {}) {
  const { window, document, navigator, location } = environment;
  const workers = navigator.serviceWorker;
  const hadController = Boolean(workers.controller);
  let pending = false, reloading = false;
  function applyPending({ safe = canReload(), state } = {}) {
    if (!pending || reloading || !safe) return false;
    reloading = true;
    beforeReload(state);
    location.reload();
    return true;
  }
  workers.addEventListener("controllerchange", () => {
    if (!hadController || !workers.controller) return;
    pending = true;
    applyPending();
  });
  async function start() {
    if (navigator.onLine === false) return;
    try {
      const registration = await workers.register("./sw.js", { updateViaCache: "none" });
      await registration.update();
    } catch (error) {
      // Continue using the complete cached game if the startup request fails.
      console.warn("App update check failed", error);
    }
  }
  if (document.readyState === "complete") void start();
  else window.addEventListener("load", start, { once: true });
  return { applyPending };
}
