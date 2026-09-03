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
          <button class="nav-toggle" id="nav-toggle" aria-label="Buka menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      ${linkHtml()}
      <div class="mobile-actions">
        <a href="${withBase("/catalog")}" class="btn btn-primary btn-block">Lihat Katalog</a>
        <a href="${withBase("/contact")}" class="btn btn-outline btn-block">Konsultasi</a>
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
