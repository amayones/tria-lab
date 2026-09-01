/**
 * Returns a button/link HTML string. Kept as a single-responsibility helper
 * so button styling stays consistent across every page and component.
 * @param {{label:string, href?:string, variant?:string, size?:string, target?:string, extraAttrs?:string}} opts
 */
export function buttonHtml({
  label,
  href = "#",
  variant = "primary", // primary | outline | whatsapp | ghost
  size = "", // "" | "sm"
  target = "",
  extraAttrs = "",
}) {
  const cls = ["btn", `btn-${variant}`, size ? `btn-${size}` : ""].filter(Boolean).join(" ");
  const targetAttr = target ? `target="${target}" rel="noopener"` : "";
  return `<a href="${href}" class="${cls}" ${targetAttr} ${extraAttrs}>${label}</a>`;
}
