import { buildWhatsappLink, consultationMessage } from "../utils/whatsapp.js";

function wireGeneralWhatsapp() {
  document.querySelectorAll("[data-whatsapp-cta]").forEach((el) => {
    el.setAttribute("href", buildWhatsappLink(consultationMessage()));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

function prefillPlan() {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan");
  const field = document.getElementById("contact-message");
  if (plan && field) {
    field.value = `Halo TRIA LAB, saya tertarik dengan paket ${plan}. Bisa dibantu jelaskan lebih detail?`;
  }
}

function wireForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    const text = `Halo TRIA LAB, saya ${name || "calon client"}.\n\n${message || "Saya ingin konsultasi kebutuhan website."}`;
    window.open(buildWhatsappLink(text), "_blank", "noopener");
  });
}

wireGeneralWhatsapp();
prefillPlan();
wireForm();
