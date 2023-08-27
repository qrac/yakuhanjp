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
})
