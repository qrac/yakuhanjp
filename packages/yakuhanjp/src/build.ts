import { rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import { generate } from "./generate.ts"

const outDir = new URL("../dist/", import.meta.url)
await rm(outDir, { recursive: true, force: true })
await generate(outDir)
console.log(fileURLToPath(outDir))
