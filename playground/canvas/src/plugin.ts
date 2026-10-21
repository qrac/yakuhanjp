import { access } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import type { Plugin } from "vite"
import { generateCanvas } from "./canvas.ts"
import {
  fonts,
  getFontWeights,
  weightNames,
  type FontName,
  type FontWeight,
} from "../../shared/options.ts"

export function pluginCanvas(): Plugin {
  const endpoint = "/api/generate-canvas"
  return {
    name: "playground:generate-canvas",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost")
        if (url.pathname !== endpoint) return next()

        const sendError = (status: number, message: string) => {
          res.statusCode = status
          res.setHeader("Content-Type", "text/plain; charset=utf-8")
          res.end(message)
        }

        if (req.method !== "GET") {
          res.setHeader("Allow", "GET")
          return sendError(405, "GETメソッドを使用してください。")
        }

        const text = url.searchParams.get("text")
        const fontName = url.searchParams.get("fontName") as FontName
        const weight = Number(url.searchParams.get("weight")) as FontWeight
        if (
          text === null ||
          !fonts.includes(fontName) ||
          !getFontWeights(fontName).includes(weight)
        ) {
          return sendError(
            400,
            "テキスト、フォント、ウェイトを確認してください。",
          )
        }

        // Resolve from this module, independent of the directory Vite was started in.
        const extension = fontName.startsWith("YakuHanJP") ? "ttf" : "otf"
        const family = `Merged${fontName}-${weightNames[weight]}`
        const fontPath = fileURLToPath(
          new URL(
            `../../../packages/merged/${fontName}/${extension}/${family}.${extension}`,
            import.meta.url,
          ),
        )

        try {
          await access(fontPath)
        } catch {
          return sendError(
            404,
            "マージフォントが見つかりません。packages/mergedを確認してください。",
          )
        }

        try {
          const image = generateCanvas({ text, fontPath, family })
          res.setHeader("Content-Type", "image/png")
          res.setHeader("Cache-Control", "no-store")
          res.end(image)
        } catch (error) {
          server.config.logger.error(String(error))
          sendError(
            500,
            "画像の生成に失敗しました。サーバーのログを確認してください。",
          )
        }
      })
    },
  }
}
