// Browsers can represent plaintext-only line breaks with divs or brs.
// innerText can count an empty div containing a br as two line breaks.
export function getEditableText(element: HTMLElement): string {
  return Array.from(element.childNodes)
    .map((node, index) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ""
      if (!(node instanceof HTMLElement)) return ""

      if (node.tagName === "BR") {
        // A lone br is the browser's placeholder for an empty editable line.
        return element.childNodes.length === 1 ? "" : "\n"
      }

      const text = getEditableText(node)
      return index > 0 && (node.tagName === "DIV" || node.tagName === "P")
        ? `\n${text}`
        : text
    })
    .join("")
}
