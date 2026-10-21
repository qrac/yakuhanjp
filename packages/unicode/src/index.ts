export function glyph2unicode(str: string) {
  const codePoint = str.codePointAt(0)
  if (codePoint === undefined) {
    throw new RangeError("Expected at least one Unicode character")
  }
  return "U+" + codePoint.toString(16).padStart(4, "0")
}

export function glyphs2unicodes(glyphs: string) {
  return Array.from(glyphs)
    .sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!)
    .map(glyph2unicode)
    .join(",")
}
