import { getWebsiteByCode, WEBSITES } from "../data/websites.js";
import { formatRupiah } from "../utils/currency.js";
import { buildWhatsappLink, orderMessage } from "../utils/whatsapp.js";
import { websiteCardHtml } from "../components/website-card.js";

const CHECK_SVG = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5l3 3 7-7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function getCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

function renderNotFound() {
  const main = document.getElementById("detail-main");
  main.innerHTML = `
    <div class="empty-state container">
      <h3>Website tidak ditemukan</h3>
      <p>Produk yang Anda cari mungkin sudah tidak tersedia.</p>
      <a href="catalog.html" class="btn btn-primary" style="margin-top:16px;">Kembali ke Katalog</a>
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
  grid.innerHTML = related.map((w) => websiteCardHtml(w)).join("");
}

function wireDeviceTabs(site) {
  const tabs = document.querySelectorAll(".device-tab");
  const frame = document.getElementById("device-frame");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      frame.className = `device-frame ${tab.dataset.device}`;
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

  document.getElementById("detail-code").textContent = site.code;
  document.getElementById("detail-title").textContent = site.name;
  document.getElementById("detail-category").textContent = site.category;
  document.getElementById("detail-price").textContent = formatRupiah(site.price);
  document.getElementById("sidebar-price").textContent = formatRupiah(site.price);
  document.getElementById("device-frame").innerHTML = `<img src="${site.preview}" alt="Preview desktop ${site.name}" />`;

  document.getElementById("detail-features").innerHTML = site.features
    .map((f) => `<li>${CHECK_SVG}${f}</li>`)
    .join("");

  document.getElementById("detail-included").innerHTML = site.included
    .map((f) => `<li>${CHECK_SVG}${f}</li>`)
    .join("");

  document.getElementById("detail-suited").innerHTML = site.suitedFor
    .map((f) => `<span>${f}</span>`)
    .join("");

  const waLink = buildWhatsappLink(orderMessage(site));
  document.querySelectorAll("[data-order-cta]").forEach((el) => {
    el.setAttribute("href", waLink);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
  document.querySelectorAll("[data-demo-cta]").forEach((el) => {
    el.setAttribute("href", site.preview);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  wireDeviceTabs(site);
  renderRelated(site);
}

render();
