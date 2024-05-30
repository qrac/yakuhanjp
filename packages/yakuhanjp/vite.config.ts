import type { PreRenderedAsset, OutputAsset } from "rollup"
import type { Plugin } from "vite"
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

function cdnPlugin(): Plugin {
  return {
    name: "vite-plugin-cdn",
    apply: "build",
    enforce: "post",
    async generateBundle(_, bundle) {
      const cdnBasePath = `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/dist/fonts/`
      const cssFiles = Object.keys(bundle).filter((fileName) =>
        fileName.endsWith(".css")
      )

      for (const fileName of cssFiles) {
        const chunk = bundle[fileName]
        if (chunk.type === "asset" && typeof chunk.source === "string") {
          let cssContent = chunk.source
          cssContent = cssContent.replace(
            /(\.\.\/fonts\/([^\/]+)\/([^\/]+\.woff2))/g,
            (match, p1, p2, p3) => {
              return `${cdnBasePath}${p2}/${p3}`
            }
          )
          const newFileName = path.join("cdn", path.basename(fileName))
          const newAsset: OutputAsset = {
            type: "asset",
            fileName: newFileName,
            source: cssContent,
            name: fileName,
            needsCodeReference: false,
          }
          bundle[newFileName] = newAsset
        }
      }
    },
  }
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
    cdnPlugin(),
  ],
})
