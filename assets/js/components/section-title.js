/**
 * Renders a section heading block (kicker optional, heading + supporting text).
 * @param {{kicker?:string, title:string, text?:string, center?:boolean}} opts
 */
export function sectionTitleHtml({ kicker = "", title, text = "", center = false }) {
  return `
    <div class="section-head ${center ? "center" : ""}">
      ${kicker ? `<p class="kicker">${kicker}</p>` : ""}
      <h2>${title}</h2>
      ${text ? `<p>${text}</p>` : ""}
    </div>
  `;
}
