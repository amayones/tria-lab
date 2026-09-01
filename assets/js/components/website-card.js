import { formatRupiah } from "../utils/currency.js";

/**
 * Renders a single website catalog card.
 * @param {object} site - an entry from WEBSITES data
 * @param {{showTags?: boolean}} [opts]
 * @returns {string} HTML string
 */
export function websiteCardHtml(site, opts = {}) {
  const { showTags = true } = opts;
  const tagsHtml = showTags
    ? `<div class="wcard__tags">${site.tags
        .slice(0, 3)
        .map((t) => `<span>${t}</span>`)
        .join("")}</div>`
    : "";

  return `
    <article class="wcard">
      <a href="website-detail.html?code=${site.code}" class="wcard__thumb">
        <span class="wcard__code">${site.code}</span>
        <img src="${site.preview}" alt="Preview website ${site.name}" loading="lazy" />
      </a>
      <div class="wcard__body">
        <span class="wcard__cat">${site.category}</span>
        <a href="website-detail.html?code=${site.code}">
          <h3 class="wcard__name">${site.name}</h3>
        </a>
        <p class="wcard__desc">${site.description}</p>
        ${tagsHtml}
        <div class="wcard__price">
          ${formatRupiah(site.price)}
          <small>Harga mulai</small>
        </div>
        <div class="wcard__actions">
          <a href="${site.preview}" class="btn btn-outline" target="_blank" rel="noopener">Live Demo</a>
          <a href="website-detail.html?code=${site.code}" class="btn btn-primary">Lihat Detail</a>
        </div>
      </div>
    </article>
  `;
}
