import type { Plugin } from "vite"
import path from "node:path"
import queryString from "node:querystring"
import fs from "fs-extra"

import { generateCanvas } from "./canvas"

export function pluginCanvas(): Plugin {
  return {
    name: "plugin:ogp",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith("/api/generate-canvas")) {
          const url = req.originalUrl
          const paramString = url?.replace("/api/generate-canvas?", "")

          if (!paramString) return

          const params = queryString.parse(paramString)
          const text = params.text as string
          const fontName = params.fontName as string
          const weightName = params.weightName as string

          const fontExt = () => {
            switch (fontName) {
              case "YakuHanJP" || "YakuHanJPs":
                return "ttf"
              case "YakuHanMP" || "YakuHanMPs":
                return "otf"
              default:
                return "otf"
            }
          }
          const fontPath = path.join(
            process.cwd(),
            "packages",
            "merged",
            fontName,
            fontExt(),
            `Merged${fontName}-${weightName}.${fontExt()}`
          )
          const family = `Merged${fontName}-${weightName}`

          // Debug base font
          /*const notoDir = () => {
            switch (fontName) {
              case "YakuHanJP" || "YakuHanJPs":
                return path.join("resource", "Noto_Sans_JP", "static")
              case "YakuHanMP" || "YakuHanMPs":
                return path.join("resource", "Noto_Serif_JP")
              default:
                return path.join("resource", "M_PLUS_Rounded_1c")
            }
          }
          const notoName = () => {
            switch (fontName) {
              case "YakuHanJP" || "YakuHanJPs":
                return "NotoSansJP"
              case "YakuHanMP" || "YakuHanMPs":
                return "NotoSerifJP"
              default:
                return "MPLUSRounded1c"
            }
          }
          const notoExt = () => {
            switch (fontName) {
              case "YakuHanJP" || "YakuHanJPs":
                return "ttf"
              case "YakuHanMP" || "YakuHanMPs":
                return "otf"
              default:
                return "ttf"
            }
          }
          const fontPath = path.join(
            process.cwd(),
            notoDir(),
            `${notoName()}-${weightName}.${notoExt()}`
          )
          const family = `${notoName()}-${weightName}`*/

          const exists = await fs.pathExists(fontPath)

          if (!exists) return
          console.log(fontPath)

          const canvas = await generateCanvas({
            text,
            fontPath,
            family,
          })

          res.end(canvas)
          return
        }
        next()
      })
    },
  }
}
