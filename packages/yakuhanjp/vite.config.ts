import type { PreRenderedAsset } from "rollup"
import path from "node:path"
import { defineConfig } from "vite"
import banner from "vite-plugin-banner"

import pkg from "./package.json"
import pjt from "./project.json"

function resolveOutput(chunkInfo: PreRenderedAsset) {
  const filePath = chunkInfo.name || ""
  const fileExt = path.extname(filePath)

  if (fileExt === ".woff2") {
    const fontName = filePath.split("-")[0]
    return path.join("fonts", fontName, "[name]" + ".[ext]")
  }
  return path.join("css", "[name]" + ".[ext]")
}

export default defineConfig({
  base: "./",
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: [
        "./src/yakuhanjp.css",
        "./src/yakuhanjp_s.css",
        "./src/yakuhanmp.css",
        "./src/yakuhanmp_s.css",
        "./src/yakuhanrp.css",
        "./src/yakuhanrp_s.css",
      ],
      output: {
        assetFileNames: (chunkInfo) => resolveOutput(chunkInfo),
      },
    },
  },
  plugins: [
    banner((filePath: string) => {
      const fileName = path.basename(filePath).split(".")[0]
      const font = pjt.fonts.find((item) => item.dist.name === fileName)
      const pkgStr = `${pjt.name} v${pkg.version} ${pkg.license} by ${pkg.author.name}`
      const typeStr = `Type: ${font?.name} - Based on ${font?.base}`
      return `${pkgStr} | ${typeStr}`
    }),
  ],
})
