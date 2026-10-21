import { mkdir, rm, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import { fonts } from "yakuhanjp/project.json" with { type: "json" }
import { glyphs2unicodes } from "./index.ts"

async function main() {
  const outDir = new URL("../dist/", import.meta.url)
  const outPath = new URL("data.json", outDir)
  const data = fonts.map(({ name, glyphs }) => ({
    name,
    glyphs: {
      str: glyphs,
      unicode: glyphs2unicodes(glyphs),
    },
  }))
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })
  await writeFile(outPath, JSON.stringify(data, null, 2) + "\n", "utf8")
  console.log(fileURLToPath(outPath))
}

await main()
