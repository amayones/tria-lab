/**
 * TRIA LAB — Vanilla PJAX Router + View Transition + Prefetch + Progress
 * Intercepts internal .html links, fetches & swaps <main id="app"> without full reload.
 * Fallback to hard navigation for external / wa.me / mailto / _blank / fetch fail.
 */

window.__routerEnabled = true;
const CACHE = new Map();
let isNavigating = false;

function getActivePage(pathname) {
  const p = pathname.split("/").pop() || "index.html";
  if (p === "" || p === "index.html") return "home";
  if (p.startsWith("catalog")) return "catalog";
  if (p.startsWith("website-detail")) return "catalog";
  if (p.startsWith("services")) return "services";
  if (p.startsWith("pricing")) return "pricing";
  if (p.startsWith("contact")) return "contact";
  return "";
}

function isInternalHtml(url) {
  try {
    const u = new URL(url, window.location.href);
    if (u.origin !== window.location.origin) return false;
    if (u.protocol === "mailto:" || u.protocol === "tel:") return false;
    const path = u.pathname;
    // allow / , /index.html, /*.html
    if (path === "/" || path.endsWith(".html")) return true;
    // also allow / without extension? treat as internal but we will fetch as-is
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
  // external origin
  try {
    const u = new URL(href, window.location.href);
    if (u.origin !== window.location.origin) return true;
  } catch { return true; }
  return false;
}

function getPageModule(pathname) {
  const p = (pathname.split("/").pop() || "index.html").split("?")[0];
  if (p === "" || p === "index.html") return { path: "../pages/home.js", init: "initHome" };
  if (p === "catalog.html") return { path: "../pages/catalog.js", init: "initCatalog" };
  if (p === "website-detail.html") return { path: "../pages/detail.js", init: "initDetail" };
  if (p === "services.html") return { path: "../pages/services.js", init: "initServices" };
  if (p === "pricing.html") return { path: "../pages/pricing.js", init: "initPricing" };
  if (p === "contact.html") return { path: "../pages/contact.js", init: "initContact" };
  return null;
}

function showProgress() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  bar.style.opacity = "1";
  bar.style.width = "30%";
  // trick to animate
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
      // force reflow
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
  const res = await fetch(url, { headers: { "X-Requested-With": "fetch" } });
  if (!res.ok) throw new Error("fetch failed " + res.status);
  const text = await res.text();
  CACHE.set(url, text);
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
  if (targetUrl.href === currentUrl.href) return;

  if (!isInternalHtml(targetUrl.href)) {
    window.location.href = targetUrl.href;
    return;
  }

  isNavigating = true;
  scheduleProgress();
  const mainEl = document.querySelector("main#app") || document.querySelector("main");
  if (mainEl) mainEl.style.viewTransitionName = "page";

  try {
    const htmlText = useCache && CACHE.has(targetUrl.href)
      ? CACHE.get(targetUrl.href)
      : await fetchHtml(targetUrl.href);

    const { main: newMain, title } = parseHtml(htmlText);
    if (!newMain) throw new Error("no <main> found");

    const doSwap = async () => {
      if (mainEl) {
        mainEl.innerHTML = newMain.innerHTML;
        // preserve id="app" and also detail-main compatibility
        if (newMain.id) mainEl.id = newMain.id;
        else mainEl.id = "app";
        // copy data-page if any
        if (newMain.dataset.page) mainEl.dataset.page = newMain.dataset.page;
      }
      if (title) document.title = title;
      if (push) history.pushState({}, "", targetUrl.href);
      closeMobileMenu();
      await updateNavbar(targetUrl.pathname);
      await runPageInit(targetUrl.pathname + targetUrl.search);
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
        // trigger enter
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
  // click intercept
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest("a");
    if (!anchor) return;
    if (shouldBypass(anchor)) return;
    const href = anchor.getAttribute("href");
    // ignore hash-only or empty
    if (!href || href.startsWith("#")) return;
    // ignore if modifier pressed
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // ignore same-page hash
    const targetUrl = new URL(href, window.location.href);
    const curUrl = new URL(window.location.href);
    if (targetUrl.pathname === curUrl.pathname && targetUrl.search === curUrl.search && targetUrl.hash) return;

    e.preventDefault();
    navigate(targetUrl.href);
  });

  // prefetch on hover/focus
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

  // popstate
  window.addEventListener("popstate", () => {
    navigate(window.location.href, { push: false, useCache: true });
  });

  // expose for debugging
  window.__routerNavigate = navigate;
}

initRouter();
