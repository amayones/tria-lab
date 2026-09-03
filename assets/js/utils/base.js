/**
 * TRIA LAB — Base path helper for subfolder hosting (e.g. /tria-lab)
 * Returns "" for root, "/tria-lab" for subfolder.
 */
export function getBasePrefix() {
  const p = window.location.pathname;
  if (p.startsWith("/tria-lab/") || p === "/tria-lab") return "/tria-lab";
  return "";
}

export function withBase(path) {
  const base = getBasePrefix();
  if (!path) return base || "/";
  if (path.startsWith("/")) return base + path;
  return base + "/" + path;
}

// For inline <base> tag detection (used by HTML head script)
export function getBaseHref() {
  const base = getBasePrefix();
  return window.location.origin + (base ? base + "/" : "/");
}
