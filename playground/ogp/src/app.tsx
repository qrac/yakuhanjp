import { useState, useEffect } from "react"
import queryString from "query-string"

const defaultText =
  "「OGP生成に使える！！？」そう、これはYakuHanJPを『元フォント』にマージしている。だから【1ファイル】のみで《約物》を〈半角〉にできるのだ。"
const fonts = [
  "YakuHanJP",
  "YakuHanJPs",
  "YakuHanMP",
  "YakuHanMPs",
  "YakuHanRP",
  "YakuHanRPs",
]
const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900]
const weightList: { [key: number]: string } = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
}

export default function () {
  const [mounted, setMounted] = useState(false)
  const [text, setText] = useState(defaultText)
  const [font, setFont] = useState(fonts[0])
  const [weight, setWeight] = useState(weights[6])
  //const [vertical, setVertical] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  async function handleClick() {
    try {
      const weightName = weightList[weight]
      const params = {
        text,
        fontName: font,
        weight,
        weightName,
        //vertical,
      }
      const paramString = queryString.stringify(params)
      const response = await fetch(`/api/generate-ogp?${paramString}`)

      if (response.ok) {
        const buffer = await response.arrayBuffer()
        const base64 = btoa(
          new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )
        setImgSrc(base64)
      } else {
        console.error("Failed to fetch file content")
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }

  useEffect(() => {
    if (mounted) {
      let paramString = window.location.search
      let params = queryString.parse(paramString)

      params = {
        ...params,
        text,
        font,
        weight: String(weight),
        //vertical: String(vertical),
      }
      paramString = queryString.stringify(params)

      const newUrl = window.location.pathname + "?" + paramString
      window.history.pushState({}, "", newUrl)
    }
  }, [text, font, weight /*vertical*/])

  useEffect(() => {
    const paramString = window.location.search

    if (paramString) {
      const params = queryString.parse(paramString)
      params?.text && setText(params.text as string)
      params?.font && setFont(params.font as string)
      params?.weight && setWeight(Number(params.weight))
      //params?.vertical && setVertical(params.vertical === "true" ? true : false)
    }
    setMounted(true)
  }, [])
  return (
    <>
      <header>
        <h1>YakuHanJP OGP生成</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <select value={font} onChange={(e) => setFont(e.target.value)}>
            {fonts.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          >
            {weights.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          {/*<label>
            <input
              type="checkbox"
              checked={vertical}
              onChange={(e) => setVertical(e.target.checked)}
            />
            vertical
          </label>*/}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "bottom",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
          <button type="button" onClick={handleClick}>
            生成
          </button>
        </div>
      </header>

      <main>
        <p>satori, @resvg/resvg-js</p>
        <div>
          {imgSrc && (
            <img
              src={"data:image/png;base64," + imgSrc}
              alt="ogp"
              width={1200}
              height={630}
            />
          )}
        </div>
      </main>
    </>
  )
}
