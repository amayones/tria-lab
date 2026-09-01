/**
 * Format a number as Indonesian Rupiah, e.g. 1499000 -> "Rp1.499.000"
 * @param {number} value
 * @returns {string}
 */
export function formatRupiah(value) {
  if (typeof value !== "number") return String(value);
  const formatted = value.toLocaleString("id-ID", { maximumFractionDigits: 0 });
  return `Rp${formatted}`;
}
