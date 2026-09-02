import { formatRupiah } from "../utils/currency.js";

const CHECK_SVG = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5l3 3 7-7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/**
 * Renders a single pricing plan card.
 * @param {object} plan - an entry from PRICING_PLANS data
 * @returns {string} HTML string
 */
export function priceCardHtml(plan) {
  const priceDisplay = typeof plan.price === "number" ? formatRupiah(plan.price) : plan.priceLabel;

  return `
    <div class="price-card ${plan.featured ? "featured" : ""}">
      ${plan.badge ? `<span class="price-card__badge">${plan.badge}</span>` : ""}
      <div class="price-card__name">${plan.name}</div>
      <div class="price-card__price">${priceDisplay}</div>
      <p class="price-card__desc">${plan.description}</p>
      <ul>
        ${plan.features.map((f) => `<li>${CHECK_SVG}${f}</li>`).join("")}
      </ul>
      <a href="/contact?plan=${encodeURIComponent(plan.name)}" class="btn ${plan.featured ? "btn-primary" : "btn-outline"} btn-block">
        Konsultasikan Kebutuhan
      </a>
    </div>
  `;
}
