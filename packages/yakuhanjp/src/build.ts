import { fileURLToPath } from "node:url"

import { generate } from "./generate.ts"

const outDir = new URL("../dist/", import.meta.url)
await generate(outDir)
console.log(fileURLToPath(outDir))
