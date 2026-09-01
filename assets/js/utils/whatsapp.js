/**
 * TRIA LAB WhatsApp contact number (international format, no leading +/0).
 * Replace with the studio's real number before deploying.
 */
export const WHATSAPP_NUMBER = "6281234567890";

/**
 * Build a wa.me link with a pre-filled message.
 * @param {string} message
 * @param {string} [number]
 * @returns {string}
 */
export function buildWhatsappLink(message, number = WHATSAPP_NUMBER) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

/**
 * Pre-filled message for ordering a specific catalog website.
 * @param {{code: string, name: string}} website
 */
export function orderMessage(website) {
  return `Hallo TRIA LAB, saya tertarik dengan website ${website.code} - ${website.name}.`;
}

/**
 * Generic consultation / contact message.
 */
export function consultationMessage() {
  return "Hallo TRIA LAB, saya ingin konsultasi kebutuhan website untuk bisnis saya.";
}
