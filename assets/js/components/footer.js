export function renderFooter() {
  const root = document.getElementById("footer-root");
  if (!root) return;

  const year = new Date().getFullYear();

  root.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer__top">
          <div class="footer__brand">
            <a href="/" class="brand">
              <img src="/assets/img/tria-lab-icon.png" alt="" width="30" height="30" />
              <span>TRIA LAB</span>
            </a>
            <p>Website &amp; Digital Solutions</p>
          </div>
          <div>
            <h4>Navigasi</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/catalog">Catalog</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Kontak</h4>
            <ul>
              <li><a href="https://wa.me/6281234567890" target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href="mailto:hello@trialab.studio">hello@trialab.studio</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© ${year} TRIA LAB. All rights reserved.</span>
          <div class="footer__social">
            <a href="#" aria-label="TikTok" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82c-1-1-1.56-2.36-1.56-3.82h-3.19v13.44c0 1.6-1.3 2.9-2.9 2.9a2.9 2.9 0 0 1 0-5.8c.3 0 .59.05.86.13V9.4a6.1 6.1 0 0 0-.86-.06 6.14 6.14 0 1 0 6.14 6.14V9.72a8.32 8.32 0 0 0 4.85 1.55V8.08a4.78 4.78 0 0 1-3.34-2.26z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
            </a>
            <a href="https://wa.me/6281234567890" aria-label="WhatsApp" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.35a9.86 9.86 0 0 0 4.62 1.15h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm0 17.9a8 8 0 0 1-4.09-1.12l-.29-.17-3.04.76.8-2.96-.19-.3a7.9 7.9 0 0 1-1.22-4.2 8 8 0 1 1 8.03 8z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
