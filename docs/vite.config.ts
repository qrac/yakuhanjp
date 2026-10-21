import type { Plugin } from "vite"
import { defineConfig, pluginIsland, pluginSsg, pluginSvg } from "minista"
import { redact } from "@tanstack/redact/vite"

export default defineConfig({
  plugins: [
    pluginSsg(),
    pluginSvg(),
    pluginIsland(),
    // Keep React for static rendering and use Redact for browser islands.
    ...redact().map(
      (plugin: Plugin): Plugin => ({
        ...plugin,
        applyToEnvironment: (environment) => environment.name === "client",
      }),
    ),
  ],
})
