/**
 * Renders the sticky navbar into #navbar-root and wires up the mobile menu.
 * @param {string} activePage - one of "home","catalog","services","pricing","contact"
 */
export function renderNavbar(activePage = "") {
  const root = document.getElementById("navbar-root");
  if (!root) return;

  const links = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "catalog.html", label: "Catalog", key: "catalog" },
    { href: "services.html", label: "Services", key: "services" },
    { href: "pricing.html", label: "Pricing", key: "pricing" },
    { href: "contact.html", label: "Contact", key: "contact" },
  ];

  const linkHtml = (extraClass = "") =>
    links
      .map(
        (l) =>
          `<a href="${l.href}" class="${extraClass}" ${l.key === activePage ? 'aria-current="page"' : ""}>${l.label}</a>`
      )
      .join("");

  root.innerHTML = `
    <nav class="navbar">
      <div class="navbar__inner">
        <a href="index.html" class="brand">
          <img src="assets/img/tria-lab-icon.png" alt="" width="30" height="30" />
          <span>TRIA LAB</span>
        </a>
        <div class="nav-links">${linkHtml()}</div>
        <div class="navbar__actions">
          <a href="catalog.html" class="btn btn-primary btn-sm">Lihat Katalog</a>
          <button class="nav-toggle" id="nav-toggle" aria-label="Buka menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      ${linkHtml()}
      <div class="mobile-actions">
        <a href="catalog.html" class="btn btn-primary btn-block">Lihat Katalog</a>
        <a href="contact.html" class="btn btn-outline btn-block">Konsultasi</a>
      </div>
    </div>
  `;

  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}
