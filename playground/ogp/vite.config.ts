import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

import { pluginOgp } from "./src/plugin"

export default defineConfig({
  plugins: [react(), pluginOgp()],
})
