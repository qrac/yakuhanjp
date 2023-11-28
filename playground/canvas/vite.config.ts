import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

import { pluginCanvas } from "./src/plugin"

export default defineConfig({
  plugins: [react(), pluginCanvas()],
})
