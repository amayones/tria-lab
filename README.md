# TRIA LAB — Website Catalog & Sales Platform

A static, multi-page website built with **HTML5 + CSS3 + Vanilla JavaScript (ES Modules)** — no frameworks, no backend, no database.

## Structure

```
/assets
  /css/style.css          → design tokens + all component/page styles
  /img                    → logo, favicon, generated preview mockups
  /js
    /components           → navbar, footer, button, website-card, price-card, section-title
    /pages                → per-page logic (home, catalog, detail, pricing, services, contact)
    /data                 → websites.js, pricing.js, services.js — content, separate from UI
    /utils                → currency.js (Rupiah formatting), whatsapp.js (wa.me deep links)
index.html
catalog.html
website-detail.html       → reads ?code=TRIA-001 from the URL
services.html
pricing.html
contact.html
```

## Adding a new website to the catalog

Open `assets/js/data/websites.js` and add a new object to the `WEBSITES` array — no other file needs to change. The catalog grid, filters, search, and detail page all read from this file automatically.

## WhatsApp number

Update `WHATSAPP_NUMBER` in `assets/js/utils/whatsapp.js` (currently a placeholder) before going live.

## Preview images

Product thumbnails in `assets/img/previews/` are stylized placeholder mockups generated for this build — swap in real screenshots of each website (same filenames, or update the `preview` path in `websites.js`) once available. For the desktop/tablet/mobile views on the detail page, add real screenshots at different widths if you want distinct crops per device (currently all three reuse the same preview image).

## Running locally (dev — readable source)

No build step required. Serve the folder with any static server, e.g.:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`. Data di `assets/js/data/*.js` masih plain untuk kemudahan edit.

## Mystery Build (production — samarkan Network & Source)

Untuk penampilan misterius-profesional (Network tab hanya `tria.app.min.js` gibberish, harga & katalog ter-encode):

```
npm install          # sekali saja
npm run build        # -> assets/dist/tria.app.min.js (obfuscated + vault)
```

HTML sudah memakai `assets/dist/tria.app.min.js`. Data asli (`assets/js/data/*.js`, `scripts/`, `vault.js`) otomatis ter-block via `.htaccess` & Worker (`404`) di production. Untuk update konten, edit `assets/js/data/websites.js` / `pricing-config.js` lalu `npm run build` ulang.

Dev bundle tanpa obfuscate: `npm run build:dev`

## Deploying

Upload the whole folder as-is to any static host (Apache, Nginx, Netlify, Vercel static, GitHub Pages, shared hosting via FTP). No server-side processing is required. Pastikan `assets/dist/tria.app.min.js` sudah ter-build sebelum upload (jalankan `npm run build`).
