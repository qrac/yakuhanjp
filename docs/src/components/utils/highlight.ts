import { createHighlighter } from "shiki"

import type { Props as SimulatorProps } from "../page/home/simulator/props"
import { getExampleKey, getFallbackFont, getFontName } from "./simulator"

export async function createSimulatorExamples(
  version: string,
  settings: SimulatorProps["settings"],
): Promise<SimulatorProps["codeExamples"]> {
  const highlighter = await createHighlighter({
    themes: ["nord"],
    langs: ["html", "css"],
  })
  const profiles = [
    { style: "sans-serif", font: "hiragino" },
    { style: "serif", font: "hiragino" },
    ...settings.googleFonts,
  ]
  const examples: Record<string, string> = {}

  try {
    for (const profile of profiles) {
      for (const target of ["all", "small"]) {
        const options = { ...profile, target }
        const html = `<!-- HTML：CDNリンクを貼り付け -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@${version}/dist/css/${getFontName(options, true)}.css">`
        const css = `/* CSS：font-familyを設定 */
.example {
  font-family: ${getFontName(options, false)}, ${getFallbackFont(options)};
}`
        examples[getExampleKey(options)] =
          highlighter.codeToHtml(html, { lang: "html", theme: "nord" }) +
          highlighter.codeToHtml(css, { lang: "css", theme: "nord" })
      }
    }
    return examples
  } finally {
    highlighter.dispose()
  }
}
