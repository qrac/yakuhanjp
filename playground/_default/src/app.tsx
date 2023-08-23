import { useState, useEffect, useRef } from "react"

import "yakuhanjp/dist/css/yakuhanjp.css"
import "yakuhanjp/dist/css/yakuhanjp_s.css"
import "yakuhanjp/dist/css/yakuhanmp.css"
import "yakuhanjp/dist/css/yakuhanmp_s.css"
import "yakuhanjp/dist/css/yakuhanrp.css"
import "yakuhanjp/dist/css/yakuhanrp_s.css"
import "yakuhanjp/dist/css/yakuhanjp-noto.css"
import "yakuhanjp/dist/css/yakuhanjp_s-noto.css"
import "yakuhanjp/dist/css/yakuhanmp-noto.css"
import "yakuhanjp/dist/css/yakuhanmp_s-noto.css"
import "yakuhanjp/dist/css/yakuhanjp-narrow.css"
import "yakuhanjp/dist/css/yakuhanjp_s-narrow.css"

const defaultDemoText =
  "「約物半角専用のWebフォント」を優先的に当てることによって、Webテキストの日本語に含まれる約物を半角にすることができました。例えば「かっこ」や『二重かっこ』、【バッジに使いそうなかっこ】などを半角にできます。ウェイトは7種類。Noto Sans Japaneseに沿っています。"
const overrideFonts = [
  "YakuHanJP",
  "YakuHanJPs",
  "YakuHanMP",
  "YakuHanMPs",
  "YakuHanRP",
  "YakuHanRPs",
  "YakuHanJP_Noto",
  "YakuHanJPs_Noto",
  "YakuHanMP_Noto",
  "YakuHanMPs_Noto",
  "YakuHanJP_Narrow",
  "YakuHanJPs_Narrow",
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

export default function () {
  const [demoText, setDemoText] = useState<string>(defaultDemoText)
  const [selectedOverrideFont, setSelectedOverrideFont] =
    useState<string>("YakuHanJP")
  const [selectedBaseFont, setSelectedBaseFont] =
    useState<string>("Hiragino Sans")
  const [selectedWeight, setSelectedWeight] = useState<number | string>(400)
  const [selectedSize, setSelectedSize] = useState<string>("1rem")
  const demoTextRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (demoTextRef.current) {
      demoTextRef.current.textContent = demoText
    }
  }, [demoText])
  return (
    <>
      <header>
        <h1>YakuHanJP</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <select
            value={selectedOverrideFont}
            onChange={(e) => setSelectedOverrideFont(e.target.value)}
          >
            {overrideFonts.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={selectedBaseFont}
            onChange={(e) => setSelectedBaseFont(e.target.value)}
          >
            {baseFonts.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value)}
          >
            {weights.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {sizes.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main>
        <table>
          <thead>
            <th>Before</th>
            <th>After</th>
          </thead>
          <tbody>
            <tr>
              <td>
                <p
                  contentEditable="true"
                  ref={demoTextRef}
                  onInput={(e: React.FormEvent<HTMLParagraphElement>) => {
                    const target = e.currentTarget
                    setDemoText(target.textContent || "")
                  }}
                  style={{
                    fontFamily: selectedBaseFont,
                    fontWeight: selectedWeight,
                    fontSize: selectedSize,
                  }}
                />
              </td>
              <td>
                <p
                  style={{
                    fontFamily: `${selectedOverrideFont}, ${selectedBaseFont}`,
                    fontWeight: selectedWeight,
                    fontSize: selectedSize,
                  }}
                >
                  {demoText}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  )
}
