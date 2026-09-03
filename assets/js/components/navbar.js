/**
 * Renders the sticky navbar into #navbar-root and wires up the mobile menu.
 * @param {string} activePage - one of "home","catalog","services","pricing","contact"
 */
function getBasePrefix() {
  const p = window.location.pathname;
  if (p.startsWith("/tria-lab/") || p === "/tria-lab") return "/tria-lab";
  return "";
}
function withBase(path) {
  const base = getBasePrefix();
  if (path.startsWith("/")) return base + path;
  if (path.startsWith("./")) return base + path.slice(1) || base + "/";
  return base + "/" + path;
}
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
  const icons = {
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 10L12 3l9 7v9a2 2 0 0 1-2 2h-2a1 1 0 0 1-1-1v-4H8v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-9Z"/></svg>`,
    catalog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`,
    services: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5"/></svg>`,
    pricing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4Z"/><path d="M9.5 11.5h5"/><path d="M12 9.5v5"/></svg>`,
    contact: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 7l9 7 9-7"/></svg>`,
  };
  const bottomItems = [
    { key: "home", label: "Home", href: withBase("/"), icon: icons.home },
    { key: "catalog", label: "Catalog", href: withBase("/catalog"), icon: icons.catalog },
    { key: "services", label: "Services", href: withBase("/services"), icon: icons.services },
    { key: "pricing", label: "Pricing", href: withBase("/pricing"), icon: icons.pricing },
    { key: "contact", label: "Contact", href: withBase("/contact"), icon: icons.contact },
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
