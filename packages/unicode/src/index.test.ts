import { describe, expect, it } from "vitest"

import { glyph2unicode, glyphs2unicodes } from "."

describe("glyph2unicode", () => {
  it("A", () => {
    const result = glyph2unicode("A")
    expect(result).toEqual("U+0041")
  })
  it("、", () => {
    const result = glyph2unicode("、")
    expect(result).toEqual("U+3001")
  })
  it("converts supplementary characters without truncating the code point", () => {
    expect(glyph2unicode("𠮷")).toEqual("U+20bb7")
    expect(glyph2unicode("\u{10ffff}")).toEqual("U+10ffff")
  })
  it("rejects an empty glyph", () => {
    expect(() => glyph2unicode("")).toThrow(RangeError)
  })
  it("pads small code points and uses the first character", () => {
    expect(glyph2unicode("\0")).toEqual("U+0000")
    expect(glyph2unicode("AB")).toEqual("U+0041")
  })
})

describe("glyphs2unicodes", () => {
  it("ABC", () => {
    const result = glyphs2unicodes("ABC")
    expect(result).toEqual("U+0041,U+0042,U+0043")
  })
  it("、。！？", () => {
    const result = glyphs2unicodes("、。！？")
    expect(result).toEqual("U+3001,U+3002,U+ff01,U+ff1f")
  })
  it("sorts mixed code points numerically and preserves repeated glyphs", () => {
    expect(glyphs2unicodes("\u{10ffff}！𠮷BAA")).toEqual(
      "U+0041,U+0041,U+0042,U+ff01,U+20bb7,U+10ffff",
    )
  })
  it("returns an empty range for empty input", () => {
    expect(glyphs2unicodes("")).toEqual("")
  })
})
