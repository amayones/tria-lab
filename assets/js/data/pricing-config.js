/**
 * TRIA LAB — Pay As You Go pricing configuration
 * Single source of truth for all prices. Edit here only.
 */

export const WEBSITE_TYPES = [
  { id: "landing", label: "Landing Page", price: 500000, desc: "Satu halaman fokus konversi" },
  { id: "company", label: "Company Profile", price: 750000, desc: "Profil perusahaan profesional" },
  { id: "business", label: "Business / Service Website", price: 900000, desc: "Bisnis & layanan lengkap" },
  { id: "catalog", label: "Online Catalog", price: 1000000, desc: "Katalog produk terstruktur" },
  { id: "custom", label: "Custom Website", price: 1500000, desc: "Kebutuhan spesifik & kompleks" },
];

export const PAGE_PRICING = {
  included: 1,
  tiers: [
    { max: 3, perPage: 150000 },
    { max: 5, perPage: 125000 },
    { max: 10, perPage: 100000 },
    { max: Infinity, perPage: 100000 },
  ],
};

export const FEATURE_GROUPS = [
  {
    id: "design",
    title: "Design & UI",
    items: [
      { id: "custom_ui", label: "Custom UI Design", desc: "Desain unik sesuai brand", price: 250000 },
      { id: "premium_animation", label: "Premium Animation / Interaction", desc: "Animasi & interaksi premium", price: 300000 },
      { id: "dark_mode", label: "Dark Mode", desc: "Tema gelap elegan", price: 150000 },
      { id: "mobile_opt", label: "Mobile Optimization", desc: "Optimasi ekstra mobile", price: 150000 },
    ],
  },
  {
    id: "business",
    title: "Business Features",
    items: [
      { id: "contact_form", label: "Contact Form", desc: "Form kontak terkoneksi email/WA", price: 100000 },
      { id: "wa_integration", label: "WhatsApp Integration", desc: "Tombol chat langsung WA", price: 100000 },
      { id: "google_maps", label: "Google Maps", desc: "Peta lokasi bisnis", price: 75000 },
      { id: "gallery", label: "Gallery", desc: "Galeri foto/video ringan", price: 150000 },
      { id: "blog", label: "Blog / News", desc: "Artikel & berita terkelola", price: 300000 },
      { id: "faq", label: "FAQ Section", desc: "Pertanyaan yang sering ditanya", price: 100000 },
      { id: "testimonials", label: "Testimonials", desc: "Blok testimoni pelanggan", price: 100000 },
      { id: "booking", label: "Booking / Reservation", desc: "Reservasi jadwal layanan", price: 500000 },
      { id: "multilang", label: "Multi-language", desc: "Dukungan multi bahasa", price: 350000 },
    ],
  },
  {
    id: "cms",
    title: "CMS & Admin",
    items: [
      { id: "cms", label: "CMS / Content Management", desc: "Kelola konten tanpa coding", price: 500000 },
      { id: "admin_dashboard", label: "Admin Dashboard", desc: "Panel admin terpusat", price: 750000 },
      { id: "auth", label: "User Login / Authentication", desc: "Login & manajemen user", price: 500000 },
      { id: "database", label: "Database", desc: "Penyimpanan data terstruktur", price: 300000 },
      { id: "crud", label: "CRUD Management", desc: "Create, read, update, delete", price: 500000 },
    ],
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    items: [
      { id: "product_catalog", label: "Product Catalog", desc: "Daftar produk terkelola", price: 300000 },
      { id: "cart", label: "Shopping Cart", desc: "Keranjang belanja", price: 400000 },
      { id: "checkout", label: "Checkout System", desc: "Alur checkout lengkap", price: 400000 },
      { id: "payment_gateway", label: "Payment Gateway", desc: "Integrasi pembayaran online", price: 500000 },
      { id: "order_mgmt", label: "Order Management", desc: "Kelola pesanan & status", price: 500000 },
    ],
  },
  {
    id: "integration",
    title: "API & Integration",
    items: [
      { id: "ga", label: "Google Analytics", desc: "Tracking kunjungan website", price: 75000 },
      { id: "gsc_setup", label: "Google Search Console Setup", desc: "Setup GSC & verifikasi", price: 100000 },
      { id: "third_api", label: "Third-party API Integration", desc: "Integrasi API pihak ketiga", price: 300000 },
      { id: "email_notif", label: "Email Notification", desc: "Notifikasi email otomatis", price: 200000 },
      { id: "wa_api", label: "WhatsApp API", desc: "Notifikasi WA otomatis", price: 350000 },
      { id: "custom_api", label: "Custom API Integration", desc: "Integrasi API custom", price: 500000 },
    ],
  },
  {
    id: "seo",
    title: "SEO",
    items: [
      { id: "basic_seo", label: "Basic SEO", desc: "Optimasi SEO dasar", price: 150000 },
      { id: "onpage_seo", label: "On-page SEO Setup", desc: "Meta, heading, struktur", price: 300000 },
      { id: "sitemap", label: "Sitemap & Robots.txt", desc: "Sitemap XML & robots", price: 100000 },
      { id: "gsc", label: "Google Search Console", desc: "Submit & monitoring SEO", price: 100000 },
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    note: "Belum termasuk biaya pihak ketiga (domain/hosting).",
    items: [
      { id: "deploy", label: "Website Deployment", desc: "Deploy ke production", price: 200000 },
      { id: "domain", label: "Custom Domain Setup", desc: "Setup domain kustom", price: 100000 },
      { id: "hosting", label: "Hosting Setup", desc: "Konfigurasi hosting", price: 150000 },
      { id: "ssl", label: "SSL Setup", desc: "Sertifikat HTTPS", price: 100000 },
    ],
  },
];

export const MAINTENANCE_OPTIONS = [
  { id: "none", label: "No Maintenance", price: 0, desc: "Tanpa layanan maintenance" },
  { id: "1m", label: "1 Month Maintenance", price: 150000, desc: "Dukungan 1 bulan" },
  { id: "3m", label: "3 Months Maintenance", price: 400000, desc: "Dukungan 3 bulan" },
  { id: "6m", label: "6 Months Maintenance", price: 750000, desc: "Dukungan 6 bulan" },
  { id: "12m", label: "12 Months Maintenance", price: 1300000, desc: "Dukungan 12 bulan" },
];

// Helper: flat map for price lookup
export const FEATURE_PRICE_MAP = (() => {
  const m = new Map();
  for (const g of FEATURE_GROUPS) for (const it of g.items) m.set(it.id, it.price);
  for (const o of MAINTENANCE_OPTIONS) m.set(o.id, o.price);
  for (const t of WEBSITE_TYPES) m.set(t.id, t.price);
  return m;
})();
