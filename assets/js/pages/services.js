import { SERVICES } from "../data/services.js";
import { buildWhatsappLink, consultationMessage } from "../utils/whatsapp.js";
import { ICONS } from "../utils/icons.js";

const CHECK_SVG = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5l3 3 7-7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function serviceCardHtml(service) {
  return `
    <article class="service-card">
      <div class="service-card__icon">${ICONS[service.icon] || ""}</div>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <ul>
        ${service.features.map((f) => `<li>${CHECK_SVG}${f}</li>`).join("")}
      </ul>
      <a href="${service.ctaHref}" class="btn btn-outline btn-block">${service.cta}</a>
    </article>
  `;
}

function render() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
  grid.innerHTML = SERVICES.map(serviceCardHtml).join("");
}

function wireWhatsapp() {
  document.querySelectorAll("[data-whatsapp-cta]").forEach((el) => {
    el.setAttribute("href", buildWhatsappLink(consultationMessage()));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

export function initServices() {
  render();
  wireWhatsapp();
}

if (!window.__routerEnabled) render();
