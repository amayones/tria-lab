/**
 * TRIA LAB — Vanilla PJAX Router + View Transition + Prefetch + Progress
 * Supports clean URLs (/catalog, /detail/TRIA-001) + legacy .html
 */

window.__routerEnabled = true;
const CACHE = new Map();
let isNavigating = false;

// Clean URL -> file mapping (for fetch)
const CLEAN_MAP = {
  "/": "/index.html",
  "/index": "/index.html",
  "/catalog": "/catalog.html",
  "/services": "/services.html",
  "/pricing": "/pricing.html",
  "/contact": "/contact.html",
};

function toFileUrl(cleanUrl) {
  try {
    const u = new URL(cleanUrl, window.location.href);
    const path = u.pathname.replace(/\/$/, "") || "/";
    // /detail/:code -> /website-detail.html?code=:code
    if (path.startsWith("/detail/")) {
      const code = path.split("/").pop();
      // preserve existing search if any, but code takes precedence
      const sp = new URLSearchParams(u.search);
      if (code) sp.set("code", code);
      return `/website-detail.html?${sp.toString()}`;
    }
    if (path === "/detail") {
      // /detail without code -> treat as catalog? fallback to website-detail without code (will show not found)
      const sp = u.search;
      return `/website-detail.html${sp}`;
    }
    if (CLEAN_MAP[path]) {
      return CLEAN_MAP[path] + u.search;
    }
    // legacy .html stays as-is
    if (path.endsWith(".html")) return u.pathname + u.search;
    // unknown clean path -> return as-is (will 404 and fallback)
    return u.pathname + u.search;
  } catch {
    return cleanUrl;
  }
}

function toCleanUrl(fileUrl) {
  try {
    const u = new URL(fileUrl, window.location.href);
    const path = u.pathname;
    if (path === "/index.html" || path === "/index") return "/" + u.search;
    if (path === "/catalog.html") return "/catalog" + u.search;
    if (path === "/services.html") return "/services" + u.search;
    if (path === "/pricing.html") return "/pricing" + u.search;
    if (path === "/contact.html") return "/contact" + u.search;
    if (path === "/website-detail.html") {
      const code = u.searchParams.get("code");
      if (code) return `/detail/${code}`;
      return "/detail" + u.search;
    }
    return path + u.search;
  } catch { return fileUrl; }
}

function getActivePage(pathname) {
  const p = pathname.replace(/\/$/, "") || "/";
  if (p === "/" || p === "/index" || p === "/index.html") return "home";
  if (p === "/catalog" || p === "/catalog.html" || p.startsWith("/detail")) return "catalog";
  if (p.startsWith("/website-detail")) return "catalog";
  if (p === "/services" || p === "/services.html") return "services";
  if (p === "/pricing" || p === "/pricing.html") return "pricing";
  if (p === "/contact" || p === "/contact.html") return "contact";
  return "";
}

function isInternalHtml(url) {
  try {
    const u = new URL(url, window.location.href);
    if (u.origin !== window.location.origin) return false;
    if (u.protocol === "mailto:" || u.protocol === "tel:") return false;
    const path = u.pathname.replace(/\/$/, "") || "/";
    if (path === "/" || path === "/index" || path === "/catalog" || path === "/services" || path === "/pricing" || path === "/contact" || path.startsWith("/detail")) return true;
    if (path.endsWith(".html")) return true;
    return false;
  } catch {
    return false;
  }
}

function shouldBypass(anchor) {
  if (!anchor) return true;
  const href = anchor.getAttribute("href");
  if (!href) return true;
  if (href.startsWith("#")) return true;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return true;
  if (href.startsWith("https://wa.me") || href.includes("wa.me")) return true;
  if (anchor.target === "_blank") return true;
  if (anchor.hasAttribute("data-no-router")) return true;
  if (anchor.hasAttribute("download")) return true;
  try {
    const u = new URL(href, window.location.href);
    if (u.origin !== window.location.origin) return true;
  } catch { return true; }
  return false;
}

function getPageModule(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  const base = path.split("?")[0];
  if (base === "/" || base === "/index" || base === "/index.html") return { path: "../pages/home.js", init: "initHome" };
  if (base === "/catalog" || base === "/catalog.html") return { path: "../pages/catalog.js", init: "initCatalog" };
  if (base.startsWith("/detail/") || base === "/detail" || base === "/website-detail.html" || base.startsWith("/website-detail")) return { path: "../pages/detail.js", init: "initDetail" };
  if (base === "/services" || base === "/services.html") return { path: "../pages/services.js", init: "initServices" };
  if (base === "/pricing" || base === "/pricing.html") return { path: "../pages/pricing.js", init: "initPricing" };
  if (base === "/contact" || base === "/contact.html") return { path: "../pages/contact.js", init: "initContact" };
  return null;
}

function showProgress() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  bar.style.opacity = "1";
  bar.style.width = "30%";
  requestAnimationFrame(() => {
    bar.style.transition = "width 200ms ease";
    bar.style.width = "70%";
  });
}

function hideProgress(success = true) {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  bar.style.width = "100%";
  setTimeout(() => {
    bar.style.opacity = "0";
    setTimeout(() => {
      bar.style.transition = "none";
      bar.style.width = "0";
      void bar.offsetWidth;
      bar.style.transition = "width 200ms ease, opacity 200ms ease";
    }, 200);
  }, 150);
}

let progressTimer = null;
function scheduleProgress() {
  clearTimeout(progressTimer);
  progressTimer = setTimeout(showProgress, 120);
}
function cancelProgress(success) {
  clearTimeout(progressTimer);
  hideProgress(success);
}

async function fetchHtml(url) {
  if (CACHE.has(url)) return CACHE.get(url);
  // translate clean URL to file URL for local dev (without Worker rewrite)
  const fileUrl = toFileUrl(url);
  const res = await fetch(fileUrl, { headers: { "X-Requested-With": "fetch" } });
  if (!res.ok) throw new Error("fetch failed " + res.status);
  const text = await res.text();
  CACHE.set(url, text);
  // also cache fileUrl variant
  CACHE.set(fileUrl, text);
  return text;
}

function parseHtml(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const main = doc.querySelector("main#app") || doc.querySelector("main");
  const title = doc.querySelector("title")?.textContent || "";
  return { main, title, doc };
}

async function runPageInit(pathname) {
  const modInfo = getPageModule(pathname);
  if (!modInfo) return;
  try {
    const mod = await import(modInfo.path);
    const fn = mod[modInfo.init];
    if (typeof fn === "function") await fn();
  } catch (e) {
    console.warn("[router] page init failed", modInfo, e);
  }
}

async function updateNavbar(pathname) {
  try {
    const { renderNavbar } = await import("../components/navbar.js");
    renderNavbar(getActivePage(pathname));
  } catch {}
}

function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const toggle = document.getElementById("nav-toggle");
  if (menu) menu.classList.remove("open");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
}

async function navigate(url, { push = true, useCache = true } = {}) {
  if (isNavigating) return;
  const targetUrl = new URL(url, window.location.href);
  const currentUrl = new URL(window.location.href);
  // normalize: compare clean versions
  const targetClean = toCleanUrl(targetUrl.href);
  const currentClean = toCleanUrl(currentUrl.href);
  if (targetClean === currentClean) return;

  if (!isInternalHtml(targetUrl.href)) {
    window.location.href = targetUrl.href;
    return;
  }

  isNavigating = true;
  scheduleProgress();
  const mainEl = document.querySelector("main#app") || document.querySelector("main");
  if (mainEl) mainEl.style.viewTransitionName = "page";

  try {
    // fetch using clean URL (will be translated to file internally)
    const fetchUrl = targetUrl.href;
    const htmlText = useCache && CACHE.has(fetchUrl)
      ? CACHE.get(fetchUrl)
      : await fetchHtml(fetchUrl);

    const { main: newMain, title } = parseHtml(htmlText);
    if (!newMain) throw new Error("no <main> found");

    const doSwap = async () => {
      if (mainEl) {
        mainEl.innerHTML = newMain.innerHTML;
        if (newMain.id) mainEl.id = newMain.id;
        else mainEl.id = "app";
        if (newMain.dataset.page) mainEl.dataset.page = newMain.dataset.page;
      }
      if (title) document.title = title;
      if (push) {
        // push clean URL
        const clean = toCleanUrl(targetUrl.href);
        history.pushState({}, "", clean);
      }
      closeMobileMenu();
      await updateNavbar(new URL(targetUrl.href, window.location.origin).pathname);
      // run init with pathname that includes detail code handling
      await runPageInit(new URL(toCleanUrl(targetUrl.href), window.location.origin).pathname + new URL(targetUrl.href).search);
      // for detail we need to propagate code via pathname too
      // if detail clean, also ensure detail init sees correct URL
      if (targetUrl.pathname.startsWith("/detail/")) {
        // detail init reads from location, already updated via pushState
      }
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    };

    if (document.startViewTransition) {
      await document.startViewTransition(doSwap).finished;
    } else {
      if (mainEl) {
        mainEl.classList.add("is-leaving");
        await new Promise((r) => setTimeout(r, 40));
        await doSwap();
        mainEl.classList.remove("is-leaving");
        mainEl.style.opacity = "0";
        mainEl.style.transform = "translateY(8px)";
        requestAnimationFrame(() => {
          mainEl.style.transition = "opacity 260ms ease, transform 260ms ease";
          mainEl.style.opacity = "1";
          mainEl.style.transform = "translateY(0)";
          setTimeout(() => {
            mainEl.style.transition = "";
            mainEl.style.opacity = "";
            mainEl.style.transform = "";
          }, 300);
        });
      } else {
        await doSwap();
      }
    }
    cancelProgress(true);
  } catch (e) {
    console.warn("[router] navigate failed, fallback", e);
    cancelProgress(false);
    window.location.href = targetUrl.href;
  } finally {
    isNavigating = false;
  }
}

function prefetch(url) {
  if (CACHE.has(url)) return;
  if (!isInternalHtml(url)) return;
  fetchHtml(url).catch(() => {});
}

function initRouter() {
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest("a");
    if (!anchor) return;
    if (shouldBypass(anchor)) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const targetUrl = new URL(href, window.location.href);
    const curUrl = new URL(window.location.href);
    if (targetUrl.pathname === curUrl.pathname && targetUrl.search === curUrl.search && targetUrl.hash) return;

    e.preventDefault();
    navigate(targetUrl.href);
  });

  let hoverTimer = null;
  document.addEventListener("mouseover", (e) => {
    const a = e.target.closest("a");
    if (!a || shouldBypass(a)) return;
    const href = a.getAttribute("href");
    if (!href) return;
    const url = new URL(href, window.location.href).href;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => prefetch(url), 80);
  });
  document.addEventListener("focusin", (e) => {
    const a = e.target.closest("a");
    if (!a || shouldBypass(a)) return;
    const href = a.getAttribute("href");
    if (!href) return;
    prefetch(new URL(href, window.location.href).href);
  });

  window.addEventListener("popstate", () => {
    navigate(window.location.href, { push: false, useCache: true });
  });

  window.__routerNavigate = navigate;
  window.__toCleanUrl = toCleanUrl;
  window.__toFileUrl = toFileUrl;
}

initRouter();
