import path from "node:path"
import fs from "fs-extra"

import { fonts } from "yakuhanjp/project.json" assert { type: "json" }
import { glyphs2unicodes } from "."

async function main() {
  const cwd = process.cwd()
  const outPath = path.join(cwd, "dist", "data.json")
  const data = fonts.map((item) => {
    return {
      name: item.name,
      glyphs: {
        str: item.glyphs,
        unicode: glyphs2unicodes(item.glyphs),
      },
    }
  })
  await fs
    .outputJSON(outPath, data, { spaces: 2 })
    .then(() => {
      console.log(outPath)
    })
    .catch((err) => {
      console.error(err)
    })
}

await main()
