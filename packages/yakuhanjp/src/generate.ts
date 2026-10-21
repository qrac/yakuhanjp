import { copyFile, mkdir, writeFile } from "node:fs/promises"

import pkg from "../package.json" with { type: "json" }
import project from "../project.json" with { type: "json" }
import { glyphs2unicodes } from "../../unicode/src/index.ts"

export async function generate(outDir: URL) {
  const cssDir = new URL("css/", outDir)
  const cdnDir = new URL("cdn/", outDir)
  await Promise.all([
    mkdir(cssDir, { recursive: true }),
    mkdir(cdnDir, { recursive: true }),
  ])

  for (const font of project.fonts) {
    const fontDir = new URL(`fonts/${font.file}/`, outDir)
    await mkdir(fontDir, { recursive: true })

    const banner = `/*! ${project.name} v${pkg.version} ${pkg.license} by ${pkg.author.name} | Type: ${font.name} - Based on ${font.base} */\n`
    const unicodeRange = glyphs2unicodes(font.glyphs)
    const rules: string[] = []
    const cdnRules: string[] = []

    for (const [weight, style] of Object.entries(font.weights)) {
      const fileName = `${font.file}-${style}.woff2`
      await copyFile(
        new URL(`../../core/${font.file}/woff2/${fileName}`, import.meta.url),
        new URL(fileName, fontDir),
      )

      const rule = (base: string) =>
        `@font-face{font-family:${font.name};font-style:normal;font-weight:${weight};font-display:swap;src:url(${base}${font.file}/${fileName}) format("woff2");unicode-range:${unicodeRange}}`
      rules.push(rule("../fonts/"))
      cdnRules.push(
        rule(`https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/dist/fonts/`),
      )
    }

    const cssName = `${font.dist.name}.css`
    await Promise.all([
      writeFile(new URL(cssName, cssDir), banner + rules.join("") + "\n", "utf8"),
      writeFile(new URL(cssName, cdnDir), banner + cdnRules.join("") + "\n", "utf8"),
    ])
  }
}
