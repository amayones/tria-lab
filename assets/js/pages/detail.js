import { getWebsiteByCode, WEBSITES } from "../data/websites.js";
import { formatRupiah } from "../utils/currency.js";
import { buildWhatsappLink, orderMessage } from "../utils/whatsapp.js";
import { websiteCardHtml } from "../components/website-card.js";

const CHECK_SVG = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5l3 3 7-7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function getCodeFromUrl() {
  // clean URL: /detail/TRIA-001
  const path = window.location.pathname;
  if (path.startsWith("/detail/")) {
    const seg = path.split("/").pop();
    if (seg && seg.startsWith("TRIA-")) return seg;
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get("code")) return params.get("code");
  // also support hash fallback
  return null;
}

function renderNotFound() {
  const main = document.getElementById("detail-main") || document.querySelector("main#app");
  if (!main) return;
  const target = document.getElementById("detail-main") || main;
  target.innerHTML = `
    <div class="empty-state container">
      <h3>Website tidak ditemukan</h3>
      <p>Produk yang Anda cari mungkin sudah tidak tersedia.</p>
      <a href="/catalog" class="btn btn-primary" style="margin-top:16px;">Kembali ke Katalog</a>
    </div>
  `;
}

function renderRelated(site) {
  const grid = document.getElementById("related-grid");
  if (!grid) return;
  const related = WEBSITES.filter((w) => w.category === site.category && w.code !== site.code).slice(0, 3);
  const section = document.getElementById("related-section");
  if (related.length === 0) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "";
  grid.innerHTML = related.map((w) => websiteCardHtml(w)).join("");
}

function getPreviewForDevice(site, device) {
  if (site.previews && site.previews[device]) return site.previews[device];
  // fallback to legacy single preview
  return site.preview;
}

function wireDeviceTabs(site) {
  const tabs = document.querySelectorAll(".device-tab");
  const frame = document.getElementById("device-frame");
  if (!tabs.length || !frame) return;
  tabs.forEach((tab) => {
    if (tab.dataset.wired === "1") return;
    tab.dataset.wired = "1";
    tab.addEventListener("click", () => {
      const device = tab.dataset.device;
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      frame.className = `device-frame ${device}`;
      const src = getPreviewForDevice(site, device);
      frame.innerHTML = `<img src="${src}" alt="Preview ${device} ${site.name}" />`;
      document.querySelectorAll("[data-demo-cta]").forEach((el) => {
        el.setAttribute("href", src);
      });
    });
  });
}

function render() {
  const code = getCodeFromUrl();
  const site = code ? getWebsiteByCode(code) : null;

  if (!site) {
    renderNotFound();
    return;
  }

  document.title = `${site.name} — TRIA LAB`;

  const elCode = document.getElementById("detail-code");
  const elTitle = document.getElementById("detail-title");
  const elCat = document.getElementById("detail-category");
  const elPrice = document.getElementById("detail-price");
  const elSidePrice = document.getElementById("sidebar-price");
  const elFrame = document.getElementById("device-frame");
  const elFeatures = document.getElementById("detail-features");
  const elIncluded = document.getElementById("detail-included");
  const elSuited = document.getElementById("detail-suited");
  const crumb = document.getElementById("detail-title-crumb");

  if (elCode) elCode.textContent = site.code;
  if (elTitle) elTitle.textContent = site.name;
  if (elCat) elCat.textContent = site.category;
  if (crumb) crumb.textContent = site.name;
  if (elPrice) elPrice.textContent = formatRupiah(site.price);
  if (elSidePrice) elSidePrice.textContent = formatRupiah(site.price);
  if (elFrame) elFrame.innerHTML = `<img src="${getPreviewForDevice(site, "desktop")}" alt="Preview desktop ${site.name}" />`;

  if (elFeatures) elFeatures.innerHTML = site.features
      .map((f) => `<li>${CHECK_SVG}${f}</li>`)
      .join("");

  if (elIncluded) elIncluded.innerHTML = site.included
      .map((f) => `<li>${CHECK_SVG}${f}</li>`)
      .join("");

  if (elSuited) elSuited.innerHTML = site.suitedFor
      .map((f) => `<span>${f}</span>`)
      .join("");

  const waLink = buildWhatsappLink(orderMessage(site));
  document.querySelectorAll("[data-order-cta]").forEach((el) => {
    el.setAttribute("href", waLink);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
  document.querySelectorAll("[data-demo-cta]").forEach((el) => {
    el.setAttribute("href", getPreviewForDevice(site, "desktop"));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  wireDeviceTabs(site);
  renderRelated(site);
}

export function initDetail() {
  render();
}

if (!window.__routerEnabled) render();
