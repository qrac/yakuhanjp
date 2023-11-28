import type { CanvasRenderingContext2D } from "canvas"
import { createCanvas, registerFont } from "canvas"

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  let currentLine = ""
  let testWidth

  for (const char of text) {
    testWidth = ctx.measureText(currentLine + char).width
    if (testWidth > maxWidth && currentLine !== "") {
      ctx.fillText(currentLine, x, y)
      currentLine = char
      y += lineHeight
    } else {
      currentLine += char
    }
  }
  if (currentLine) {
    ctx.fillText(currentLine, x, y)
  }
}

export async function generateCanvas({
  text,
  fontPath,
  family,
}: {
  text: string
  fontPath: string
  family: string
}) {
  registerFont(fontPath, { family })

  const width = 1200
  const height = 630
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "#e6e6e6"
  ctx.fillRect(0, 0, width / 2, height)
  ctx.fillStyle = "#f2f2f2"
  ctx.fillRect(width / 2, 0, width / 2, height)

  ctx.fillStyle = "#333333"
  ctx.font = `60px "${family}"`
  const maxWidth = 1040
  const lineHeight = 100
  const x = (width - maxWidth) / 2
  const y = (height - 390) / 2

  ctx.textAlign = "left"
  ctx.textBaseline = "top"
  wrapText(ctx, text, x, y, maxWidth, lineHeight)

  return canvas.toBuffer()
}
