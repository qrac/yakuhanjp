import { defineConfig, pluginIsland, pluginSsg, pluginSvg } from "minista"
import { redact } from "@tanstack/redact/vite"
import rehypePrettyCode from "rehype-pretty-code"

export default defineConfig({
  plugins: [
    pluginSsg({
      mdx: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              grid: false,
              theme: "nord",
              keepBackground: false,
              keepFigure: false,
            },
          ],
        ],
      },
    }),
    pluginSvg(),
    pluginIsland(),
    redact({
      preset: "nano",
      features: {
        hydration: true,
      },
    }),
  ],
})
