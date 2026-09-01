import { PRICING_PLANS } from "../data/pricing.js";
import { priceCardHtml } from "../components/price-card.js";

function render() {
  const grid = document.getElementById("pricing-grid");
  if (!grid) return;
  grid.innerHTML = PRICING_PLANS.map((plan) => priceCardHtml(plan)).join("");
}

render();
