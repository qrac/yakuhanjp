import { useEffect, useRef } from "react"
import {
  fonts as overFonts,
  weights,
  readChoice,
} from "../../shared/options.ts"
import { useQueryState } from "../../shared/use-query-state.ts"

import "yakuhanjp/dist/css/yakuhanjp.css"
import "yakuhanjp/dist/css/yakuhanjp_s.css"
import "yakuhanjp/dist/css/yakuhanmp.css"
import "yakuhanjp/dist/css/yakuhanmp_s.css"
import "yakuhanjp/dist/css/yakuhanrp.css"
import "yakuhanjp/dist/css/yakuhanrp_s.css"

const defaultText =
  "「約物半角専用のWebフォント」を優先的に当てることによって、Webテキストの日本語に含まれる約物を半角にすることができました。例えば「かっこ」や『二重かっこ』、【バッジに使いそうなかっこ】などを半角にできます。ウェイトは9種類。Noto Sans JPに沿っています。内包文字→、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝"
const baseFonts = [
  "Hiragino Sans",
  "Hiragino Kaku Gothic ProN",
  "Noto Sans JP",
  "'Yu Gothic Medium'",
  "YuGothic",
  "Meiryo",
  "-apple-system",
  "Hiragino Mincho ProN",
  "Noto Serif JP",
  "YuMincho",
  "'M PLUS Rounded 1c'",
  "sans-serif",
  "serif",
]
const sizes = [
  "0.625rem",
  "0.75rem",
  "0.875rem",
  "1rem",
  "1.25rem",
  "1.5rem",
  "2rem",
]
const features = ["feature", "palt", "halt", "pkna"]

function readSettings(params: URLSearchParams) {
  return {
    text: params.get("text") ?? defaultText,
    overFont: readChoice(params.get("overFont"), overFonts, overFonts[0]),
    baseFont: readChoice(params.get("baseFont"), baseFonts, baseFonts[0]),
    weight: readChoice(params.get("weight"), weights, 400),
    size: readChoice(params.get("size"), sizes, "1rem"),
    feature: readChoice(params.get("feature"), features, "feature"),
    vertical: params.get("vertical") === "true",
  }
}

export default function App() {
  const [settings, setSettings] = useQueryState(readSettings)
  const { text, overFont, baseFont, weight, size, feature, vertical } = settings
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // Avoid replacing the editable DOM while typing, which resets the caret.
    if (textRef.current && textRef.current.textContent !== text) {
      textRef.current.textContent = text
    }
  }, [text])

  return (
    <>
      <header>
        <h1>YakuHanJP</h1>
        <div className="controls">
          <select
            aria-label="約物フォント"
            value={overFont}
            onChange={(e) =>
              setSettings({
                ...settings,
                overFont: readChoice(e.target.value, overFonts, overFonts[0]),
              })
            }
          >
            {overFonts.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            aria-label="ベースフォント"
            value={baseFont}
            onChange={(e) =>
              setSettings({
                ...settings,
                baseFont: readChoice(e.target.value, baseFonts, baseFonts[0]),
              })
            }
          >
            {baseFonts.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            aria-label="ウェイト"
            value={weight}
            onChange={(e) =>
              setSettings({
                ...settings,
                weight: readChoice(e.target.value, weights, 400),
              })
            }
          >
            {weights.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            aria-label="文字サイズ"
            value={size}
            onChange={(e) =>
              setSettings({
                ...settings,
                size: readChoice(e.target.value, sizes, "1rem"),
              })
            }
          >
            {sizes.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            aria-label="文字詰め"
            value={feature}
            onChange={(e) =>
              setSettings({
                ...settings,
                feature: readChoice(e.target.value, features, "feature"),
              })
            }
          >
            {features.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={vertical}
              onChange={(e) =>
                setSettings({ ...settings, vertical: e.target.checked })
              }
            />
            vertical
          </label>
        </div>
      </header>

      <main>
        <table>
          <thead>
            <tr>
              <th>Before</th>
              <th>After</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  writingMode: vertical ? "vertical-rl" : undefined,
                  fontFeatureSettings:
                    feature !== "feature" ? `"${feature}"` : undefined,
                }}
              >
                <p
                  contentEditable="plaintext-only"
                  role="textbox"
                  aria-label="比較するテキスト"
                  aria-multiline="true"
                  ref={textRef}
                  onInput={(e: React.FormEvent<HTMLParagraphElement>) => {
                    const target = e.currentTarget
                    setSettings({ ...settings, text: target.textContent ?? "" })
                  }}
                  style={{
                    fontFamily: baseFont,
                    fontWeight: weight,
                    fontSize: size,
                  }}
                />
              </td>
              <td
                style={{
                  writingMode: vertical ? "vertical-rl" : undefined,
                  fontFeatureSettings:
                    feature !== "feature" ? `"${feature}"` : undefined,
                }}
              >
                <p
                  style={{
                    fontFamily: `${overFont}, ${baseFont}`,
                    fontWeight: weight,
                    fontSize: size,
                  }}
                >
                  {text}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  )
}
