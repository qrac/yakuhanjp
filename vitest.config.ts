import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["./packages/unicode/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "./playground/**/*.*"],
    testTimeout: 20000,
  },
})
