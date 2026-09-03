import { withBase } from "../utils/base.js";
import { ICONS } from "../utils/icons.js";

/**
 * Renders the sticky navbar into #navbar-root and wires up the mobile menu.
 * @param {string} activePage - one of "home","catalog","services","pricing","contact"
 */
export function renderNavbar(activePage = "") {
  const root = document.getElementById("navbar-root");
  if (!root) return;

  const links = [
    { href: withBase("/"), label: "Home", key: "home" },
    { href: withBase("/catalog"), label: "Catalog", key: "catalog" },
    { href: withBase("/services"), label: "Services", key: "services" },
    { href: withBase("/pricing"), label: "Pricing", key: "pricing" },
    { href: withBase("/contact"), label: "Contact", key: "contact" },
  ];

  const linkHtml = (extraClass = "") =>
    links
      .map(
        (l) =>
          `<a href="${l.href}" class="${extraClass}" ${l.key === activePage ? 'aria-current="page"' : ""}>${l.label}</a>`
      )
      .join("");

  const asset = (p) => withBase(p);
  const bottomItems = [
    { key: "home", label: "Home", href: withBase("/"), icon: ICONS.home },
    { key: "catalog", label: "Catalog", href: withBase("/catalog"), icon: ICONS.catalog },
    { key: "services", label: "Services", href: withBase("/services"), icon: ICONS.services },
    { key: "pricing", label: "Pricing", href: withBase("/pricing"), icon: ICONS.pricing },
    { key: "contact", label: "Contact", href: withBase("/contact"), icon: ICONS.contact },
  ];

  // On subsequent PJAX navigations, just update active states to avoid flicker
  if (root.dataset.initialized === "1") {
    // Top nav
    root.querySelectorAll(".nav-links a, .navbar a.brand").forEach((a) => {
      const href = a.getAttribute("href");
      const item = links.find((l) => l.href === href);
      if (item) {
        if (item.key === activePage) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      }
    });
    // Bottom nav
    const bottom = document.getElementById("bottom-nav");
    if (bottom) {
      bottom.querySelectorAll("a").forEach((a) => {
        const href = a.getAttribute("href");
        const item = bottomItems.find((b) => b.href === href);
        if (item) {
          if (item.key === activePage) a.setAttribute("aria-current", "page");
          else a.removeAttribute("aria-current");
        }
      });
    }
    return;
  }

  const bottomHtml = bottomItems
    .map(
      (it) => `<a href="${it.href}" ${it.key === activePage ? 'aria-current="page"' : ""} aria-label="${it.label}">${it.icon}<span>${it.label}</span></a>`
    )
    .join("");
  root.innerHTML = `
    <nav class="navbar">
      <div class="navbar__inner">
        <a href="${withBase("/")}" class="brand">
          <img src="${asset("/assets/img/tria-lab-icon.png")}" alt="" width="30" height="30" />
          <span>TRIA LAB</span>
        </a>
        <div class="nav-links">${linkHtml()}</div>
        <div class="navbar__actions">
          <a href="${withBase("/catalog")}" class="btn btn-primary btn-sm">Lihat Katalog</a>
        </div>
      </div>
    </nav>
    <nav class="bottom-nav" id="bottom-nav" aria-label="Primary">
      ${bottomHtml}
    </nav>
  `;
  root.dataset.initialized = "1";
}
