import { WEBSITES, CATEGORIES } from "../data/websites.js";
import { websiteCardHtml } from "../components/website-card.js";

const state = {
  category: "Semua",
  query: "",
};

function matches(site) {
  const inCategory = state.category === "Semua" || site.category === state.category;
  const q = state.query.trim().toLowerCase();
  const inQuery =
    q === "" ||
    site.name.toLowerCase().includes(q) ||
    site.category.toLowerCase().includes(q) ||
    site.code.toLowerCase().includes(q);
  return inCategory && inQuery;
}

function render() {
  const grid = document.getElementById("catalog-grid");
  const empty = document.getElementById("catalog-empty");
  if (!grid) return;

  const results = WEBSITES.filter(matches);

  if (results.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
  } else {
    if (empty) empty.style.display = "none";
    grid.innerHTML = results.map((site) => websiteCardHtml(site)).join("");
  }
}

function renderChips() {
  const container = document.getElementById("filter-chips");
  if (!container) return;
  const categories = ["Semua", ...CATEGORIES];
  container.innerHTML = categories
    .map(
      (cat) =>
        `<button class="chip ${cat === state.category ? "active" : ""}" data-category="${cat}">${cat}</button>`
    )
    .join("");

  container.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.category;
      container.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      render();
    });
  });
}

function wireSearch() {
  const input = document.getElementById("catalog-search");
  if (!input) return;
  // avoid double listener after router re-init: clone if already wired
  if (input.dataset.wired === "1") return;
  input.dataset.wired = "1";
  input.addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });
}

function applyUrlCategory() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("category");
  if (cat && (cat === "Semua" || CATEGORIES.includes(cat))) {
    state.category = cat;
  } else {
    state.category = "Semua";
  }
  // also restore query from input if any
  const input = document.getElementById("catalog-search");
  if (input) state.query = input.value || "";
}

export function initCatalog() {
  applyUrlCategory();
  renderChips();
  wireSearch();
  render();
}

if (!window.__routerEnabled) {
  initCatalog();
}
