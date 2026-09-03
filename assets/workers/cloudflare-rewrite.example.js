/**
 * TRIA LAB — Cloudflare Worker rewrite for clean URLs
 * Deploy to trust.trialab.workers.dev
 *
 * Clean URLs:
 *   /            -> /index.html
 *   /catalog     -> /catalog.html
 *   /services    -> /services.html
 *   /pricing     -> /pricing.html
 *   /contact     -> /contact.html
 *   /detail/TRIA-001 -> /website-detail.html?code=TRIA-001
 *
 * Legacy .html URLs still work via 301 to clean.
 */

const CLEAN_TO_FILE = {
  "/": "/index.html",
  "/catalog": "/catalog.html",
  "/services": "/services.html",
  "/pricing": "/pricing.html",
  "/contact": "/contact.html",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";

    // Mystery: block direct vault/data leaks (bundled in /assets/dist/tria.app.min.js)
    if (
      path.startsWith("/assets/js/data/") ||
      path === "/assets/js/bundle.entry.js" ||
      path === "/assets/js/utils/vault.js" ||
      path.startsWith("/scripts/") ||
      path.startsWith("/tmp/")
    ) {
      return new Response("Not Found", { status: 404 });
    }

    // 301 legacy .html -> clean
    if (path.endsWith(".html")) {
      const clean = toClean(path, url.search);
      if (clean) {
        return Response.redirect(`${url.origin}${clean}`, 301);
      }
    }

    // Rewrite clean -> file, then fetch asset
    let filePath = null;
    if (CLEAN_TO_FILE[path]) {
      filePath = CLEAN_TO_FILE[path] + url.search;
    } else if (path.startsWith("/detail/")) {
      const code = path.split("/").pop();
      const sp = new URLSearchParams(url.search);
      if (code) sp.set("code", code);
      filePath = `/website-detail.html?${sp.toString()}`;
    } else if (path === "/detail") {
      filePath = `/website-detail.html${url.search}`;
    }

    if (filePath) {
      const fileUrl = new URL(filePath, url.origin);
      const req = new Request(fileUrl, request);
      return fetch(req);
    }

    // passthrough: assets, api, etc.
    return fetch(request);
  },
};

function toClean(path, search) {
  if (path === "/index.html") return "/" + search;
  if (path === "/catalog.html") return "/catalog" + search;
  if (path === "/services.html") return "/services" + search;
  if (path === "/pricing.html") return "/pricing" + search;
  if (path === "/contact.html") return "/contact" + search;
  if (path === "/website-detail.html") {
    const sp = new URLSearchParams(search);
    const code = sp.get("code");
    if (code) return `/detail/${code}`;
    return "/detail" + search;
  }
  return null;
}
