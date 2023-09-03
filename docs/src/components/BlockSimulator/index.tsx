import { useState, useEffect, useRef } from "react"
import classNames from "classnames"

import pkg from "yakuhanjp/package.json"

type Options = {
  style: string
  target: string
  font: string
  weight: number
  size: string
  vertical: boolean
}

type GoogleFontsItem = {
  style: string
  font: string
  family: string
  weights: number[]
}

const defaultText =
  "「約物半角専用のWebフォント」を優先的に当てることによって、Webテキストの日本語に含まれる約物を半角にすることができました。例えば「かっこ」や『二重かっこ』、【バッジに使いそうなかっこ】などを半角にできます。ウェイトは9種類。Noto Sans JPに沿っています。"
const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900]
const sizes = [
  "0.625rem",
  "0.75rem",
  "0.875rem",
  "1rem",
  "1.125rem",
  "1.25rem",
  "1.5rem",
  "2rem",
]

const googleFontsList: GoogleFontsItem[] = [
  {
    style: "sans-serif",
    font: "noto",
    family: "Noto+Sans+JP",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  {
    style: "serif",
    font: "noto",
    family: "Noto+Serif+JP",
    weights: [200, 300, 400, 500, 600, 700, 900],
  },
  {
    style: "rounded-sans-serif",
    font: "mplusr1c",
    family: "M+PLUS+Rounded+1c",
    weights: [100, 300, 400, 500, 700, 800, 900],
  },
]

export default function () {
  const [text, setText] = useState(defaultText)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (textRef.current) {
      textRef.current.textContent = text
    }
  }, [text])

  const [options, setOptions] = useState<Options>({
    style: "sans-serif",
    target: "all",
    font: "hiragino",
    weight: 400,
    size: "1rem",
    vertical: false,
  })
  function onChangeOptions(value: Options) {
    setOptions(value)
  }
  function switchFontYakuHan({ callFileName }: { callFileName: boolean }) {
    switch (true) {
      case options.style === "sans-serif" && options.target === "small":
        return callFileName ? "yakuhanjp_s" : "YakuHanJPs"
      case options.style === "serif" && options.target === "all":
        return callFileName ? "yakuhanmp" : "YakuHanMP"
      case options.style === "serif" && options.target === "small":
        return callFileName ? "yakuhanmp_s" : "YakuHanMPs"
      case options.style === "rounded-sans-serif" && options.target === "all":
        return callFileName ? "yakuhanrp" : "YakuHanRP"
      case options.style === "rounded-sans-serif" && options.target === "small":
        return callFileName ? "yakuhanrp_s" : "YakuHanRPs"
      default:
        return callFileName ? "yakuhanjp" : "YakuHanJP"
    }
  }
  function switchFontFallback() {
    switch (true) {
      case options.style === "sans-serif" && options.font === "noto":
        return `"Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif`
      case options.style === "serif" && options.font === "hiragino":
        return `"Hiragino Mincho ProN", "Noto Serif JP", "Yu Mincho", YuMincho, serif`
      case options.style === "serif" && options.font === "noto":
        return `"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", YuMincho, serif`
      case options.style === "rounded-sans-serif" &&
        options.font === "mplusr1c":
        return `"M PLUS Rounded 1c", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
      default:
        return `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
    }
  }
  const textBeforeStyles = {
    fontSize: options.size,
    fontWeight: Number(options.weight),
    fontFamily: switchFontFallback(),
  }
  const textAfterStyles = {
    fontSize: options.size,
    fontWeight: Number(options.weight),
    fontFamily: [
      switchFontYakuHan({ callFileName: false }),
      switchFontFallback(),
    ].join(", "),
  }

  const [googleFonts, setGoogleFonts] = useState<string[]>([])

  function getGoogleFonts(item: GoogleFontsItem) {
    if (options.style === item.style && options.font === item.font) {
      const fontUrl = "https://fonts.googleapis.com/css2?family="
      const fontName = `${item.family}:wght@${String(options.weight)}`
      const fontWeights = item.weights
      const checkWeight = fontWeights.some((w) => w === options.weight)

      if (checkWeight && !googleFonts.includes(fontName)) {
        const head = document.getElementsByTagName("head")[0] as HTMLElement
        const linkTag = document.createElement("link")
        linkTag.rel = "stylesheet"
        linkTag.href = `${fontUrl}${fontName}&display=swap`
        head.appendChild(linkTag)
        setGoogleFonts([...googleFonts, fontName])
      }
    }
  }
  useEffect(() => {
    googleFontsList.map((item) => getGoogleFonts(item))
  }, [options])
  return (
    <div className="block-simulator">
      <ul className="block-simulator-grid is-buttons">
        <li className="block-simulator-grid-col">
          <SimulatorButton
            label="ゴシック体"
            onChange={onChangeOptions}
            setValueObject={{
              ...options,
              style: "sans-serif",
              font: "hiragino",
            }}
            active={options.style === "sans-serif"}
            show={true}
          />
          <SimulatorButton
            label="明朝体"
            onChange={onChangeOptions}
            setValueObject={{
              ...options,
              style: "serif",
              font: "hiragino",
            }}
            active={options.style === "serif"}
            show={true}
          />
          <SimulatorButton
            label="丸ゴシック"
            onChange={onChangeOptions}
            setValueObject={{
              ...options,
              style: "rounded-sans-serif",
              font: "mplusr1c",
            }}
            active={options.style === "rounded-sans-serif"}
            show={true}
          />
        </li>
        <li className="block-simulator-grid-col">
          <SimulatorButton
            label="すべて"
            onChange={onChangeOptions}
            setValueObject={{ ...options, target: "all" }}
            active={options.target === "all"}
            show={true}
          />
          <SimulatorButton
            label="カッコのみ"
            onChange={onChangeOptions}
            setValueObject={{ ...options, target: "small" }}
            active={options.target === "small"}
            show={true}
          />
        </li>
        <li className="block-simulator-grid-col">
          <SimulatorButton
            label="Hiragino"
            onChange={onChangeOptions}
            setValueObject={{ ...options, font: "hiragino" }}
            active={options.font === "hiragino"}
            show={options.style === "sans-serif" || options.style === "serif"}
          />
          <SimulatorButton
            label="Noto"
            onChange={onChangeOptions}
            setValueObject={{ ...options, font: "noto" }}
            active={options.font === "noto"}
            show={options.style === "sans-serif" || options.style === "serif"}
          />
          <SimulatorButton
            label="M PLUS Rounded 1c"
            onChange={onChangeOptions}
            setValueObject={{ ...options, font: "mplusr1c" }}
            active={options.font === "mplusr1c"}
            show={options.style === "rounded-sans-serif"}
          />
        </li>
        <li className="block-simulator-grid-col">
          <SimulatorButton
            label="横書き"
            onChange={onChangeOptions}
            setValueObject={{ ...options, vertical: false }}
            active={!options.vertical}
            show={true}
          />
          <SimulatorButton
            label="縦書き"
            onChange={onChangeOptions}
            setValueObject={{ ...options, vertical: true }}
            active={options.vertical}
            show={true}
          />
        </li>
        <li className="block-simulator-grid-col">
          {weights.map((weight, index) => (
            <SimulatorButton
              label={`w${String(weight)}`}
              onChange={onChangeOptions}
              setValueObject={{ ...options, weight: Number(weight) }}
              active={options.weight === Number(weight)}
              show={true}
              key={index}
            />
          ))}
        </li>
        <li className="block-simulator-grid-col">
          {sizes.map((size, index) => (
            <SimulatorButton
              label={size}
              onChange={onChangeOptions}
              setValueObject={{ ...options, size: size }}
              active={options.size === size}
              show={true}
              key={index}
            />
          ))}
        </li>
      </ul>
      <ul className={classNames("block-simulator-grid is-previews")}>
        <li className="block-simulator-grid-col">
          <p className="block-simulator-preview-label">{"Before"}</p>
          <div
            className="block-simulator-preview-wrap"
            style={{
              writingMode: options.vertical ? "vertical-rl" : undefined,
            }}
          >
            <p
              contentEditable={true}
              ref={textRef}
              onInput={(e: React.FormEvent<HTMLParagraphElement>) => {
                const target = e.currentTarget
                setText(target.textContent || "")
              }}
              className="block-simulator-preview is-edit"
              style={textBeforeStyles}
            />
          </div>
        </li>
        <li className="block-simulator-grid-col">
          <p className="block-simulator-preview-label">{"After"}</p>
          <div
            className="block-simulator-preview-wrap"
            style={{
              writingMode: options.vertical ? "vertical-rl" : undefined,
            }}
          >
            <p className="block-simulator-preview" style={textAfterStyles}>
              {text}
            </p>
          </div>
        </li>
      </ul>
      <SimulatorCode
        fileName={switchFontYakuHan({ callFileName: true })}
        override={switchFontYakuHan({ callFileName: false })}
        fallback={switchFontFallback()}
      />
    </div>
  )
}

function SimulatorButton({
  label,
  onChange,
  setValueObject,
  active,
  show,
}: {
  label: string
  onChange: any
  setValueObject: Options
  active: boolean
  show: boolean
}) {
  return (
    show && (
      <button
        onClick={() => onChange(setValueObject)}
        className={classNames("block-simulator-button", active && "is-active")}
        type="button"
      >
        {label}
      </button>
    )
  )
}

function SimulatorCode({
  fileName,
  override,
  fallback,
}: {
  fileName: string
  override: string
  fallback: string
}) {
  const codeTemplate = `<code><span class="token comment">&lt;!-- HTML：CDNリンクを貼り付け --&gt;</span>
&lt;<span class="token tag">link</span> <span class="token attr-name">rel</span>="<span class="token attr-value">stylesheet</span>" <span class="token attr-name">href</span>="<span class="token attr-value">https://cdn.jsdelivr.net/npm/yakuhanjp@${pkg.version}/dist/css/${fileName}.css</span>"&gt;

<span class="token comment">// CSS：font-familyを設定</span>
<span class="token attr-name">.example</span> {
  font-family: <span class="token keyword">${override}</span>, <span class="token attr-value">${fallback}</span>;
}</code>`
  return (
    <div className="block-simulator-code">
      {/* prettier-ignore */}
      <pre><code><span className="token comment">&lt;!-- HTML：CDNリンクを貼り付け --&gt;</span><br/>
&lt;<span className="token tag">link</span> <span className="token attr-name">rel</span>="<span className="token attr-value">stylesheet</span>" <span className="token attr-name">href</span>="<span className="token attr-value">{`https://cdn.jsdelivr.net/npm/yakuhanjp@${pkg.version}/dist/css/${fileName}.css`}</span>"&gt;<br/>
<br/>
<span className="token comment">// CSS：font-familyを設定</span><br/>
<span className="token attr-name">.example</span>{' {'}<br/>
{"  font-family: "}<span className="token keyword">{override}</span>{", "}<span className="token attr-value">{fallback}</span>;<br/>
{'}'}</code></pre>
    </div>
  )
}
