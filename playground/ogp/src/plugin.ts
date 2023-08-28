import type { Plugin } from "vite"
import path from "node:path"
import queryString from "node:querystring"
import fs from "fs-extra"

import { generateOgp } from "./ogp"

export function pluginOgp(): Plugin {
  return {
    name: "plugin:ogp",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith("/api/generate-ogp")) {
          const url = req.originalUrl
          const paramString = url?.replace("/api/generate-ogp?", "")

          if (!paramString) return

          const params = queryString.parse(paramString)
          const text = params.text as string
          const fontName = params.fontName as string
          const weightName = params.weightName as string
          const fontPath = path.join(
            process.cwd(),
            "packages",
            "merged",
            fontName,
            "otf",
            `Merged${fontName}-${weightName}.otf`
          )
          const exists = await fs.pathExists(fontPath)

          if (!exists) return

          const font = await fs.readFile(fontPath)
          const ogp = await generateOgp({ text, font })

          res.end(ogp)
          return
        }
        next()
      })
    },
  }
}
