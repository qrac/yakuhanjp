import { mkdtemp, readFile, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { afterAll, beforeAll, expect, it } from "vitest"

import pkg from "../package.json" with { type: "json" }
import { generate } from "./generate.ts"

let outDir: URL

beforeAll(async () => {
  const tempDir = await mkdtemp(join(tmpdir(), "yakuhanjp-test-"))
  outDir = pathToFileURL(tempDir + "/")
  await generate(outDir)
})

afterAll(async () => {
  if (outDir) await rm(outDir, { recursive: true, force: true })
})

it("preserves published CSS paths and copies every referenced font unchanged", async () => {
  const names = [
    "yakuhanjp.css",
    "yakuhanjp_s.css",
    "yakuhanmp.css",
    "yakuhanmp_s.css",
    "yakuhanrp.css",
    "yakuhanrp_s.css",
  ]
  const cssDir = new URL("css/", outDir)
  expect((await readdir(cssDir)).sort()).toEqual(names)
  expect((await readdir(new URL("cdn/", outDir))).sort()).toEqual(names)

  let fontCount = 0
  for (const name of names) {
    const css = await readFile(new URL(name, cssDir), "utf8")
    const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1])
    expect(urls.length).toBe(name.startsWith("yakuhanjp") ? 9 : 7)

    for (const url of urls) {
      expect(url).toMatch(/^\.\.\/fonts\/([^/]+)\/\1-[^/]+\.woff2$/)
      const [family, fileName] = url.slice("../fonts/".length).split("/")
      const source = new URL(
        `../../core/${family}/woff2/${fileName}`,
        import.meta.url,
      )
      expect(await readFile(new URL(url, cssDir))).toEqual(await readFile(source))
      fontCount++
    }

    const cdn = await readFile(new URL(`cdn/${name}`, outDir), "utf8")
    expect(cdn).toBe(
      css.replaceAll(
        "../fonts/",
        `https://cdn.jsdelivr.net/npm/yakuhanjp@${pkg.version}/dist/fonts/`,
      ),
    )
  }
  expect(fontCount).toBe(46)
  expect(
    (await readdir(new URL("fonts/", outDir), { recursive: true })).length,
  ).toBe(52)
})

it("includes the license banner and distinguishes full and brackets-only ranges", async () => {
  const full = await readFile(new URL("css/yakuhanjp.css", outDir), "utf8")
  const small = await readFile(new URL("css/yakuhanjp_s.css", outDir), "utf8")
  expect(
    full.startsWith(
      `/*! Yaku Han JP v${pkg.version} (OFL-1.1 AND MIT) by Qrac | Type: YakuHanJP - Based on Noto Sans JP */\n`,
    ),
  ).toBe(true)
  expect(full).toContain(
    "font-family:YakuHanJP;font-style:normal;font-weight:100;font-display:swap;",
  )
  expect(small).toContain("font-family:YakuHanJPs;")
  expect(full).toContain("unicode-range:U+3001,U+3002,U+3008")
  expect(small).toContain("unicode-range:U+3008,U+3009")
  expect(small).not.toContain("U+3001")
  expect(small).not.toContain("U+ff01")
})
