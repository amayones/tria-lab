# previews-catalog

Folder untuk screenshot katalog TRIA LAB (dipakai preview + previews di websites.js).

## KenDrive - TRIA-008
- Card catalog: kendrive.jpg (field preview)
- Detail Desktop: kendrive-desktop.png (previews.desktop)
- Detail Tablet: kendrive-tablet.png (previews.tablet)
- Detail Mobile: kendrive-mobile.png (previews.mobile)

## NexusReel - TRIA-007
- Card catalog: nexusreel.jpg (field preview)
- Detail Desktop: nexusreel-desktop.png (previews.desktop)
- Detail Tablet: nexusreel-tablet.png (previews.tablet)
- Detail Mobile: nexusreel-mobile.png (previews.mobile)

Ukuran rekomendasi:
- Desktop: 1920x1080 / 1440x900
- Tablet: 768x1024 / 820x1180
- Mobile: 390x844 / 360x800

Cara pakai: export screenshot -> simpan dengan nama persis di atas -> tidak perlu ubah kode.
Card pakai site.preview (website-card.js:25), detail pakai site.previews[device] (detail.js:36).
Jika tablet/mobile belum ada, otomatis fallback ke desktop.
