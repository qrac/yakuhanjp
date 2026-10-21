import type { Plugin } from "vite"
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
    // Keep React for static rendering and use Redact for browser islands.
    ...redact().map((plugin: Plugin): Plugin => ({
      ...plugin,
      applyToEnvironment: (environment) => environment.name === "client",
    })),
  ],
})
