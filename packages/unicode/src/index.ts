export function glyph2unicode(str: string) {
  const hexStr = "000" + str.charCodeAt(0).toString(16)
  return "U+" + hexStr.substring(hexStr.length - 4)
}

export function glyphs2unicodes(glyphs: string) {
  const splitedGlyphs = glyphs.split("")
  return splitedGlyphs
    .map((item) => glyph2unicode(item))
    .sort()
    .join()
}
