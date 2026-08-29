// Thin, safe wrapper around localStorage. Every piece of user data IruCalc
// keeps (favorites, recents, calculation history, theme) lives only here —
// nothing is ever sent to a server, and there is no login.

const PREFIX = "irucalc:";

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or disabled — fail silently, the app still works.
  }
}

export const storage = { read, write };

// ---- Favorites ----
export function getFavorites() {
  return read("favorites", []);
}
export function toggleFavorite(slug) {
  const favs = getFavorites();
  const next = favs.includes(slug) ? favs.filter((s) => s !== slug) : [slug, ...favs];
  write("favorites", next);
  return next;
}

// ---- Recently used ----
export function getRecents() {
  return read("recents", []);
}
export function pushRecent(slug) {
  const recents = getRecents().filter((s) => s !== slug);
  const next = [slug, ...recents].slice(0, 8);
  write("recents", next);
  return next;
}

// ---- Calculation history (per calculator) ----
export function getHistory(slug) {
  return read(`history:${slug}`, []);
}
export function pushHistory(slug, entry) {
  const existing = getHistory(slug);
  const next = [{ ...entry, ts: Date.now() }, ...existing].slice(0, 20);
  write(`history:${slug}`, next);
  return next;
}
export function clearHistory(slug) {
  write(`history:${slug}`, []);
}

// ---- Theme ----
export function getStoredTheme() {
  return read("theme", null);
}
export function setStoredTheme(theme) {
  write("theme", theme);
}
