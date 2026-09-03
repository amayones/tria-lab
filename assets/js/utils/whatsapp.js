/**
 * TRIA LAB WhatsApp contact number (international format, no leading +/0).
 * Replace with the studio's real number before deploying.
 */
export const WHATSAPP_NUMBER = "6283168176608";

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

/**
 * Build WhatsApp message from Pay As You Go pricing state.
 * @param {{ websiteTypeLabel:string, pages:number, selectedLabels:string[], maintenanceLabel:string, breakdown:{ basePrice:number, pagesCost:number, otherFeaturesCost:number, deploymentCost:number, maintenanceCost:number, total:number }, totalFormatted:string }} data
 */
export function buildPricingWhatsappMessage(data) {
  const lines = [];
  lines.push("Hallo TRIA LAB, saya ingin konsultasi kebutuhan website dengan rincian:");
  lines.push("");
  lines.push(`Website Type: ${data.websiteTypeLabel}`);
  lines.push(`Jumlah Halaman: ${data.pages}`);
  if (data.selectedLabels.length > 0) {
    lines.push(`Fitur yang dipilih (${data.selectedLabels.length}):`);
    for (const l of data.selectedLabels) lines.push(`- ${l}`);
  } else {
    lines.push("Fitur yang dipilih: (belum memilih fitur tambahan)");
  }
  lines.push("");
  lines.push(`Rincian Estimasi:`);
  lines.push(`- Website Base: ${data.breakdown.baseFormatted}`);
  lines.push(`- Additional Pages: ${data.breakdown.pagesFormatted}`);
  if (data.breakdown.otherFeaturesCost > 0) lines.push(`- Features: ${data.breakdown.featuresFormatted}`);
  if (data.breakdown.deploymentCost > 0) lines.push(`- Deployment: ${data.breakdown.deploymentFormatted}`);
  if (data.breakdown.maintenanceCost > 0) lines.push(`- Maintenance: ${data.breakdown.maintenanceFormatted}`);
  lines.push(`Estimated Total: ${data.totalFormatted}`);
  lines.push("");
  lines.push("Mohon dibantu untuk quotation final. Terima kasih!");
  return lines.join("\n");
}
