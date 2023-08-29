import { useState, useEffect, useRef } from "react"
import queryString from "query-string"

import "yakuhanjp/src/yakuhanjp.css"
import "yakuhanjp/src/yakuhanjp_s.css"
import "yakuhanjp/src/yakuhanmp.css"
import "yakuhanjp/src/yakuhanmp_s.css"
import "yakuhanjp/src/yakuhanrp.css"
import "yakuhanjp/src/yakuhanrp_s.css"

const defaultText =
  "「約物半角専用のWebフォント」を優先的に当てることによって、Webテキストの日本語に含まれる約物を半角にすることができました。例えば「かっこ」や『二重かっこ』、【バッジに使いそうなかっこ】などを半角にできます。ウェイトは9種類。Noto Sans JPに沿っています。内包文字→、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝"
const overFonts = [
  "YakuHanJP",
  "YakuHanJPs",
  "YakuHanMP",
  "YakuHanMPs",
  "YakuHanRP",
  "YakuHanRPs",
]
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
const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900]
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

export default function () {
  const [mounted, setMounted] = useState(false)
  const [text, setText] = useState(defaultText)
  const [overFont, setOverFont] = useState(overFonts[0])
  const [baseFont, setBaseFont] = useState(baseFonts[0])
  const [weight, setWeight] = useState<number | string>(weights[3])
  const [size, setSize] = useState(sizes[3])
  const [feature, setFeature] = useState(features[0])
  const [vertical, setVertical] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (textRef.current) {
      textRef.current.textContent = text
    }
  }, [text])

  useEffect(() => {
    if (mounted) {
      let paramString = window.location.search
      let params = queryString.parse(paramString)

      params = {
        ...params,
        text,
        overFont,
        baseFont,
        weight: String(weight),
        size,
        feature,
        vertical: String(vertical),
      }
      paramString = queryString.stringify(params)

      const newUrl = window.location.pathname + "?" + paramString
      window.history.pushState({}, "", newUrl)
    }
  }, [text, overFont, baseFont, weight, size, feature, vertical])

  useEffect(() => {
    const paramString = window.location.search

    if (paramString) {
      const params = queryString.parse(paramString)
      params?.text && setText(params.text as string)
      params?.overFont && setOverFont(params.overFont as string)
      params?.baseFont && setBaseFont(params.baseFont as string)
      params?.weight && setWeight(Number(params.weight))
      params?.size && setSize(params.size as string)
      params?.feature && setFeature(params.feature as string)
      params?.vertical && setVertical(params.vertical === "true" ? true : false)
    }
    setMounted(true)
  }, [])
  return (
    <>
      <header>
        <h1>YakuHanJP</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <select
            value={overFont}
            onChange={(e) => setOverFont(e.target.value)}
          >
            {overFonts.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={baseFont}
            onChange={(e) => setBaseFont(e.target.value)}
          >
            {baseFonts.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select value={weight} onChange={(e) => setWeight(e.target.value)}>
            {weights.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            {sizes.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select value={feature} onChange={(e) => setFeature(e.target.value)}>
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
              onChange={(e) => setVertical(e.target.checked)}
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
                  contentEditable="true"
                  ref={textRef}
                  onInput={(e: React.FormEvent<HTMLParagraphElement>) => {
                    const target = e.currentTarget
                    setText(target.textContent || "")
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
