import { SERVICES } from "../data/services.js";

const ICONS = {
  layout: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>`,
  pen: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  code: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m13 5-2 14"/></svg>`,
};

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

render();
