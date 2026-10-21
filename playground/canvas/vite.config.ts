import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

import { pluginCanvas } from "./src/plugin.ts"

export default defineConfig({
  plugins: [react(), pluginCanvas()],
})
