import { WEBSITES } from "../data/websites.js";
import { websiteCardHtml } from "../components/website-card.js";
import { buildWhatsappLink, consultationMessage } from "../utils/whatsapp.js";

function renderFeaturedCatalog() {
  const grid = document.getElementById("featured-catalog-grid");
  if (!grid) return;
  const featured = WEBSITES.slice(0, 4);
  grid.innerHTML = featured.map((site) => websiteCardHtml(site)).join("");
}

function wireWhatsappLinks() {
  document.querySelectorAll("[data-whatsapp-cta]").forEach((el) => {
    el.setAttribute("href", buildWhatsappLink(consultationMessage()));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

export function initHome() {
  renderFeaturedCatalog();
  wireWhatsappLinks();
}

// auto-init for hard load (non-router fallback)
if (!window.__routerEnabled) initHome();
