/**
 * TRIA LAB Vault — runtime decoder for obfuscated payloads
 * Key is split to avoid trivial grep; self-defending after obfuscation.
 */
const _k1 = atob("VFJJQQ=="); // TRIA
const _k2 = atob("X0xBQg=="); // _LAB
const _k3 = String.fromCharCode(50,48,50,54); // 2026
const KEY = _k1 + _k2 + _k3; // TRIA_LAB2026

export function _d(b64) {
  try {
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const keyBytes = new TextEncoder().encode(KEY);
    const out = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
    return new TextDecoder().decode(out);
  } catch {
    return "";
  }
}

export function _j(b64) {
  const txt = _d(b64);
  try {
    return JSON.parse(txt, (k, v) => (v === "__INF__" ? Infinity : v));
  } catch { return null; }
}

// Elegant console watermark — professional mystery
if (typeof window !== "undefined" && !window.__TRIA_WM) {
  window.__TRIA_WM = 1;
  try {
    console.log("%c TRIA LAB %c Professional Digital Studio ", "background:#7C3AED;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:700", "background:#1B1A1F;color:#A78BFA;padding:4px 8px;border-radius:0 4px 4px 0");
  } catch {}
}
