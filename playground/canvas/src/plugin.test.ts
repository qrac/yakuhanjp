import assert from "node:assert/strict"
import { access } from "node:fs/promises"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"
import {
  fonts,
  getFontWeights,
  readChoice,
  weightNames,
} from "../../shared/options.ts"

// Check the selectable combinations against the actual shipped font files.
test("all offered fonts and weights have merged font files", async () => {
  for (const font of fonts) {
    for (const weight of getFontWeights(font)) {
      const extension = font.startsWith("YakuHanJP") ? "ttf" : "otf"
      await access(
        new URL(
          `../../../packages/merged/${font}/${extension}/Merged${font}-${weightNames[weight]}.${extension}`,
          import.meta.url,
        ),
      )
    }
  }
  assert.equal(readChoice("invalid", fonts, fonts[0]), fonts[0])
  assert.equal(readChoice("100", getFontWeights("YakuHanMP"), 700), 700)
})

test("native config serves PNGs and finishes invalid requests", async () => {
  const server = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    configLoader: "native",
    logLevel: "silent",
    server: { host: "127.0.0.1", port: 0, watch: null },
  })
  try {
    await server.listen()
    const address = server.httpServer!.address()
    assert.ok(address && typeof address !== "string")
    const base = `http://127.0.0.1:${address.port}/api/generate-canvas`
    const request = (query: string, method = "GET") =>
      fetch(`${base}${query}`, {
        method,
        signal: AbortSignal.timeout(10000),
      })
    for (const font of fonts) {
      const params = new URLSearchParams({
        text: "「日本語」\n『改行』",
        fontName: font,
        weight: "700",
      })
      const response = await request(`?${params}`)
      assert.equal(response.status, 200)
      assert.equal(response.headers.get("content-type"), "image/png")
      const png = Buffer.from(await response.arrayBuffer())
      assert.deepEqual(
        png.subarray(0, 8),
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      )
      assert.equal(png.readUInt32BE(16), 1200)
      assert.equal(png.readUInt32BE(20), 630)
    }
    assert.equal((await request("")).status, 400)
    assert.equal(
      (await request("?text=test&fontName=../../test&weight=700")).status,
      400,
    )
    assert.equal(
      (await request("?text=test&fontName=YakuHanMP&weight=100")).status,
      400,
    )
    assert.equal(
      (await request("?text=test&fontName=YakuHanJP&weight=700", "POST"))
        .status,
      405,
    )
    assert.equal(
      (await request("?text=&fontName=YakuHanJP&weight=700")).status,
      200,
    )
  } finally {
    await server.close()
  }
})
