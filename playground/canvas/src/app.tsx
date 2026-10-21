import { useEffect, useRef, useState } from "react"
import { fonts, getFontWeights, readChoice } from "../../shared/options.ts"
import { useQueryState } from "../../shared/use-query-state.ts"

const defaultText =
  "「OGP生成に使える！！？」そう、これはYakuHanJPを『元フォント』にマージしている。だから【1ファイル】のみで《約物》を〈半角〉にできるのだ。"

function readSettings(params: URLSearchParams) {
  const font = readChoice(params.get("font"), fonts, fonts[0])
  return {
    text: params.get("text") ?? defaultText,
    font,
    weight: readChoice(params.get("weight"), getFontWeights(font), 700),
  }
}

export default function App() {
  const [settings, setSettings] = useQueryState(readSettings)
  const { text, font, weight } = settings
  const [imageUrl, setImageUrl] = useState<string>()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const requestRef = useRef<AbortController | null>(null)

  useEffect(() => () => requestRef.current?.abort(), [])
  useEffect(
    () => () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    },
    [imageUrl],
  )

  async function generateImage() {
    requestRef.current?.abort()
    const request = new AbortController()
    requestRef.current = request
    setPending(true)
    setError("")
    try {
      const params = new URLSearchParams({
        text,
        fontName: font,
        weight: String(weight),
      })
      const response = await fetch(`/api/generate-canvas?${params}`, {
        signal: request.signal,
      })
      if (!response.ok) throw new Error(await response.text())
      const blob = await response.blob()
      if (!request.signal.aborted) setImageUrl(URL.createObjectURL(blob))
    } catch (error) {
      if (!request.signal.aborted) {
        setError(
          error instanceof Error ? error.message : "画像の生成に失敗しました。",
        )
      }
    } finally {
      if (!request.signal.aborted) setPending(false)
    }
  }

  return (
    <>
      <header>
        <h1>YakuHanJP Canvas生成</h1>
        <div className="controls">
          <select
            aria-label="フォント"
            value={font}
            onChange={(event) => {
              const nextFont = readChoice(event.target.value, fonts, fonts[0])
              const availableWeights = getFontWeights(nextFont)
              setSettings({
                ...settings,
                font: nextFont,
                weight: availableWeights.includes(weight) ? weight : 700,
              })
            }}
          >
            {fonts.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            aria-label="ウェイト"
            value={weight}
            onChange={(event) => {
              setSettings({
                ...settings,
                weight: readChoice(
                  event.target.value,
                  getFontWeights(font),
                  700,
                ),
              })
            }}
          >
            {getFontWeights(font).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <form
          className="image-form"
          onSubmit={(event) => {
            event.preventDefault()
            void generateImage()
          }}
        >
          <textarea
            aria-label="画像に表示するテキスト"
            value={text}
            onChange={(event) =>
              setSettings({ ...settings, text: event.target.value })
            }
          />
          <button type="submit" disabled={pending}>
            {pending ? "生成中…" : "生成"}
          </button>
        </form>
        {error && <p role="alert">{error}</p>}
      </header>
      <main aria-busy={pending}>
        <p>node-canvas / 1200 × 630</p>
        {imageUrl && (
          <img src={imageUrl} alt="生成した画像" width={1200} height={630} />
        )}
      </main>
    </>
  )
}
