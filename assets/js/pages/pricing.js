import { WEBSITE_TYPES, FEATURE_GROUPS, MAINTENANCE_OPTIONS } from "../data/pricing-config.js";
import { calculatePricing } from "../utils/pricing-calculator.js";
import { formatRupiah } from "../utils/currency.js";
import { buildWhatsappLink, buildPricingWhatsappMessage } from "../utils/whatsapp.js";

const state = {
  websiteType: "landing",
  pages: 1,
  selected: new Set(),
  maintenance: "none",
};

function getWebsiteLabel(id) {
  const t = WEBSITE_TYPES.find((x) => x.id === id);
  return t ? t.label : id;
}

function renderConfig() {
  const root = document.getElementById("pricing-config");
  if (!root) return;

  // Website Type
  const typeHtml = `
    <div class="config-section" data-section="type">
      <div class="config-section__head"><h3>Website Type</h3><span class="badge-count">Base Price</span></div>
      <div class="type-options">
        ${WEBSITE_TYPES.map(
          (t) => `
          <label class="type-option">
            <input type="radio" name="websiteType" value="${t.id}" ${t.id === state.websiteType ? "checked" : ""} />
            <span class="type-option__label"><strong>${t.label}</strong><span>${t.desc}</span></span>
            <span class="type-option__price">${formatRupiah(t.price)}</span>
          </label>`
        ).join("")}
      </div>
    </div>`;

  // Pages
  const pagesHtml = `
    <div class="config-section" data-section="pages">
      <div class="config-section__head"><h3>Jumlah Halaman</h3></div>
      <p class="config-section__note">1 halaman sudah termasuk dalam base price. Halaman tambahan dihitung per tier.</p>
      <div class="pages-control">
        <div class="pages-stepper">
          <button type="button" data-pages-dec aria-label="Kurangi halaman">−</button>
          <input type="number" id="pages-input" min="1" max="99" value="${state.pages}" inputmode="numeric" />
          <button type="button" data-pages-inc aria-label="Tambah halaman">+</button>
        </div>
        <span class="pages-hint" id="pages-hint"></span>
      </div>
    </div>`;

  // Feature groups
  const groupsHtml = FEATURE_GROUPS.map(
    (g) => `
    <div class="config-section" data-section="${g.id}">
      <div class="config-section__head"><h3>${g.title}</h3></div>
      ${g.note ? `<p class="config-section__note">${g.note}</p>` : ""}
      <div class="feature-group">
        ${g.items
          .map(
            (it) => `
          <label class="feature-item">
            <input type="checkbox" value="${it.id}" ${state.selected.has(it.id) ? "checked" : ""} />
            <span class="feature-item__text"><strong>${it.label}</strong><span>${it.desc}</span></span>
            <span class="feature-item__price">+${formatRupiah(it.price)}</span>
          </label>`
          )
          .join("")}
      </div>
    </div>`
  ).join("");

  // Maintenance
  const maintHtml = `
    <div class="config-section" data-section="maintenance">
      <div class="config-section__head"><h3>Maintenance</h3><span class="badge-count">Optional</span></div>
      <p class="config-section__note">Maintenance adalah layanan recurring terpisah dari biaya pembuatan website utama.</p>
      <div class="maint-options">
        ${MAINTENANCE_OPTIONS.map(
          (m) => `
          <label class="maint-option">
            <input type="radio" name="maintenance" value="${m.id}" ${m.id === state.maintenance ? "checked" : ""} />
            <span class="maint-option__label"><strong>${m.label}</strong><span>${m.desc}</span></span>
            <span class="maint-option__price">${m.price === 0 ? "Rp0" : "+" + formatRupiah(m.price)}</span>
          </label>`
        ).join("")}
      </div>
    </div>`;

  root.innerHTML = typeHtml + pagesHtml + groupsHtml + maintHtml;
}

function calc() {
  return calculatePricing({
    websiteType: state.websiteType,
    pages: state.pages,
    selected: state.selected,
    maintenance: state.maintenance,
  });
}

function renderSummary() {
  const b = calc();
  const summaryEl = document.getElementById("pricing-summary");
  const mobileEl = document.getElementById("mobile-summary-bar");
  const pagesHint = document.getElementById("pages-hint");

  if (pagesHint) {
    if (b.pagesCost === 0) pagesHint.innerHTML = `1 halaman <strong>included</strong>`;
    else {
      const add = b.pages - 1;
      pagesHint.innerHTML = `${b.pages} halaman • <strong>${add} tambahan</strong> • ${formatRupiah(b.pagesCost)}`;
    }
  }

  const selectedCount = b.selectedCount;
  const counterText = `${selectedCount} fitur dipilih`;

  // Build selected labels for WhatsApp
  const allItems = new Map();
  for (const g of FEATURE_GROUPS) for (const it of g.items) allItems.set(it.id, it.label);

  const breakdown = {
    baseFormatted: formatRupiah(b.basePrice),
    pagesFormatted: formatRupiah(b.pagesCost),
    featuresFormatted: formatRupiah(b.otherFeaturesCost),
    deploymentFormatted: formatRupiah(b.deploymentCost),
    maintenanceFormatted: formatRupiah(b.maintenanceCost),
  };

  const summaryInner = `
    <div class="summary-title">Your Estimate</div>
    <div class="summary-sub">${counterText} • Update realtime</div>
    <div class="summary-rows">
      <div class="summary-row"><span>Website Base</span><span>${formatRupiah(b.basePrice)}</span></div>
      <div class="summary-row"><span>Additional Pages${b.pages > 1 ? ` (${b.pages - 1} halaman)` : ""}</span><span>${formatRupiah(b.pagesCost)}</span></div>
      <div class="summary-row"><span>Features</span><span>${formatRupiah(b.otherFeaturesCost)}</span></div>
      <div class="summary-row"><span>Deployment</span><span>${formatRupiah(b.deploymentCost)}</span></div>
      <div class="summary-row"><span>Maintenance</span><span>${formatRupiah(b.maintenanceCost)}</span></div>
      <div class="summary-row total"><span>Estimated Total</span><span>${formatRupiah(b.total)}</span></div>
    </div>
    ${selectedCount > 0 ? `<div class="summary-features">${[...state.selected].map((id) => allItems.get(id) || id).join(" • ")}</div>` : `<div class="summary-features">Belum memilih fitur tambahan</div>`}
    <button type="button" class="btn btn-primary btn-block summary-cta" data-pricing-cta>Konsultasikan &amp; Pesan — ${formatRupiah(b.total)}</button>
    <p class="summary-note">Harga estimasi. Final quotation menyesuaikan kompleksitas.</p>
  `;

  if (summaryEl) summaryEl.innerHTML = summaryInner;

  // Mobile bar
  if (mobileEl) {
    const detailRows = `
      <div class="summary-row"><span>Website Base</span><span>${formatRupiah(b.basePrice)}</span></div>
      <div class="summary-row"><span>Pages</span><span>${formatRupiah(b.pagesCost)}</span></div>
      <div class="summary-row"><span>Features</span><span>${formatRupiah(b.otherFeaturesCost)}</span></div>
      <div class="summary-row"><span>Deployment</span><span>${formatRupiah(b.deploymentCost)}</span></div>
      <div class="summary-row"><span>Maintenance</span><span>${formatRupiah(b.maintenanceCost)}</span></div>
    `;
    mobileEl.innerHTML = `
      <div class="mobile-summary-bar__inner">
        <div class="mobile-summary-bar__text">
          <small>${counterText} <button type="button" class="mobile-summary-toggle" data-toggle-detail>Detail</button></small>
          <strong>${formatRupiah(b.total)}</strong>
        </div>
        <button type="button" class="btn btn-primary" data-pricing-cta-mobile>Pesan</button>
      </div>
      <div class="mobile-summary-bar__detail" id="mobile-detail">
        ${detailRows}
      </div>
    `;
  }

  wireCta();
  wireMobileToggle();
}

function wireCta() {
  const breakdown = calc();
  const allItems = new Map();
  for (const g of FEATURE_GROUPS) for (const it of g.items) allItems.set(it.id, it.label);
  const selectedLabels = [...state.selected].map((id) => allItems.get(id) || id);
  const maintLabel = (MAINTENANCE_OPTIONS.find((m) => m.id === state.maintenance) || {}).label || state.maintenance;
  const msg = buildPricingWhatsappMessage({
    websiteTypeLabel: getWebsiteLabel(state.websiteType),
    pages: breakdown.pages,
    selectedLabels,
    maintenanceLabel: maintLabel,
    breakdown: {
      baseFormatted: formatRupiah(breakdown.basePrice),
      pagesFormatted: formatRupiah(breakdown.pagesCost),
      featuresFormatted: formatRupiah(breakdown.otherFeaturesCost),
      deploymentFormatted: formatRupiah(breakdown.deploymentCost),
      maintenanceFormatted: formatRupiah(breakdown.maintenanceCost),
    },
    totalFormatted: formatRupiah(breakdown.total),
  });
  const link = buildWhatsappLink(msg);
  document.querySelectorAll("[data-pricing-cta],[data-pricing-cta-mobile]").forEach((el) => {
    el.setAttribute("data-href", link);
    if (!el.dataset.wiredCta) {
      el.dataset.wiredCta = "1";
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const href = el.getAttribute("data-href");
        if (href) window.open(href, "_blank", "noopener");
      });
    }
  });
}

function wireMobileToggle() {
  const btn = document.querySelector("[data-toggle-detail]");
  const detail = document.getElementById("mobile-detail");
  if (!btn || !detail || btn.dataset.wired === "1") return;
  btn.dataset.wired = "1";
  btn.addEventListener("click", () => {
    const open = detail.classList.toggle("open");
    btn.textContent = open ? "Tutup" : "Detail";
  });
}

function wireEvents() {
  const root = document.getElementById("pricing-config");
  if (!root || root.dataset.wired === "1") return;
  root.dataset.wired = "1";

  root.addEventListener("change", (e) => {
    const t = e.target;
    if (t.name === "websiteType") {
      state.websiteType = t.value;
      renderSummary();
    } else if (t.name === "maintenance") {
      state.maintenance = t.value;
      renderSummary();
    } else if (t.type === "checkbox") {
      if (t.checked) state.selected.add(t.value);
      else state.selected.delete(t.value);
      renderSummary();
    }
  });

  root.addEventListener("click", (e) => {
    const dec = e.target.closest("[data-pages-dec]");
    const inc = e.target.closest("[data-pages-inc]");
    if (dec) {
      e.preventDefault();
      state.pages = Math.max(1, state.pages - 1);
      const inp = document.getElementById("pages-input");
      if (inp) inp.value = String(state.pages);
      renderSummary();
    }
    if (inc) {
      e.preventDefault();
      state.pages = Math.min(99, state.pages + 1);
      const inp = document.getElementById("pages-input");
      if (inp) inp.value = String(state.pages);
      renderSummary();
    }
  });

  root.addEventListener("input", (e) => {
    if (e.target.id === "pages-input") {
      let v = parseInt(e.target.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      if (v > 99) v = 99;
      state.pages = v;
      renderSummary();
    }
  });

  // blur to clamp
  root.addEventListener("change", (e) => {
    if (e.target.id === "pages-input") {
      let v = parseInt(e.target.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      if (v > 99) v = 99;
      state.pages = v;
      e.target.value = String(v);
      renderSummary();
    }
  });
}

export function initPricing() {
  // reset state on every init (refresh/navigation) as requested: no persist
  state.websiteType = "landing";
  state.pages = 1;
  state.selected = new Set();
  state.maintenance = "none";

  // clear wired flag to allow re-render after PJAX navigation
  const root = document.getElementById("pricing-config");
  if (root) root.removeAttribute("data-wired");

  renderConfig();
  wireEvents();
  renderSummary();
}

if (!window.__routerEnabled) initPricing();
