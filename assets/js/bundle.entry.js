/**
 * TRIA LAB — Bundled entry (mystery professional)
 * Single entry for all pages. Router handles PJAX + init.
 */
import "./utils/router.js"; // sets window.__routerEnabled = true before page modules evaluate their if(!window.__routerEnabled) guards
import { renderNavbar } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";
import { getBasePrefix, stripBase } from "./utils/base.js";
import "./utils/vault.js"; // watermark

// Static imports for bundling — replaces dynamic import() in router for single-file mystery
import { initHome } from "./pages/home.js";
import { initCatalog } from "./pages/catalog.js";
import { initDetail } from "./pages/detail.js";
import { initServices } from "./pages/services.js";
import { initPricing } from "./pages/pricing.js";
import { initContact } from "./pages/contact.js";

function getActivePage(pathname) {
  const raw = pathname.replace(/\/$/, "") || "/";
  const p = stripBase(raw);
  if (p === "/" || p === "/index" || p === "/index.html") return "home";
  if (p === "/catalog" || p === "/catalog.html" || p.startsWith("/detail")) return "catalog";
  if (p.startsWith("/website-detail")) return "catalog";
  if (p === "/services" || p === "/services.html") return "services";
  if (p === "/pricing" || p === "/pricing.html") return "pricing";
  if (p === "/contact" || p === "/contact.html") return "contact";
  return "";
}

function boot() {
  const active = getActivePage(window.location.pathname);
  try { renderNavbar(active); } catch {}
  try { renderFooter(); } catch {}

  // DOM-based routing — reliable even when stringArray obfuscates pathname literals
  if (document.getElementById("featured-catalog-grid")) { try { initHome(); } catch(e){console.warn(e)} return; }
  if (document.getElementById("catalog-grid")) { try { initCatalog(); } catch(e){console.warn(e)} return; }
  if (document.getElementById("detail-main") || document.getElementById("detail-code")) { try { initDetail(); } catch(e){console.warn(e)} return; }
  if (document.getElementById("services-grid")) { try { initServices(); } catch(e){console.warn(e)} return; }
  if (document.getElementById("pricing-config")) { try { initPricing(); } catch(e){console.warn(e)} return; }
  if (document.getElementById("contact-form")) { try { initContact(); } catch(e){console.warn(e)} return; }

  // Fallback to pathname (for PJAX swaps where DOM not yet updated)
  const clean = stripBase(window.location.pathname.replace(/\/$/, "") || "/");
  const base = clean.split("?")[0];
  if (base === "/" || base === "/index" || base === "/index.html") initHome();
  else if (base === "/catalog" || base === "/catalog.html") initCatalog();
  else if (base.startsWith("/detail/") || base === "/detail" || base === "/website-detail.html" || base.startsWith("/website-detail")) initDetail();
  else if (base === "/services" || base === "/services.html") initServices();
  else if (base === "/pricing" || base === "/pricing.html") initPricing();
  else if (base === "/contact" || base === "/contact.html") initContact();
}

// Expose for router PJAX to re-boot without dynamic import
window.__triaBoot = boot;
window.__triaPageMap = { initHome, initCatalog, initDetail, initServices, initPricing, initContact };

// Initial boot
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

// Listen to PJAX navigate completion (router will dispatch)
window.addEventListener("tria:navigated", () => {
  boot();
});
