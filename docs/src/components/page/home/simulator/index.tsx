import { useState, useEffect, useRef } from "react"
import clsx from "clsx"

import {
  getFontName,
  getFallbackFont,
  getExampleKey,
} from "../../../utils/simulator"
import type { Options, Props } from "./props"
import "./style.css"

export default function PageHomeSimulator({ settings, codeExamples }: Props) {
  const { defaultText, weights, sizes, googleFonts: googleFontsList } = settings
  const [text, setText] = useState(defaultText)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (textRef.current) {
      textRef.current.textContent = defaultText
    }
  }, [defaultText])

  const [options, setOptions] = useState<Options>(settings.initialOptions)
  function onChangeOptions(value: Options) {
    setOptions(value)
  }
  const textBeforeStyles = {
    fontSize: options.size,
    fontWeight: Number(options.weight),
    fontFamily: getFallbackFont(options),
  }
  const textAfterStyles = {
    fontSize: options.size,
    fontWeight: Number(options.weight),
    fontFamily: [getFontName(options, false), getFallbackFont(options)].join(
      ", ",
    ),
  }

  const [googleFonts, setGoogleFonts] = useState<string[]>([])

  function getGoogleFonts(item: Props["settings"]["googleFonts"][number]) {
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
    <div className="simulator">
      <ul className="simulator-grid is-buttons">
        <li className="simulator-grid-col">
          {settings.styles.map(({ label, style, font }) => (
            <SimulatorButton
              key={style}
              label={label}
              onChange={onChangeOptions}
              setValueObject={{ ...options, style, font }}
              active={options.style === style}
            />
          ))}
        </li>
        <li className="simulator-grid-col">
          {settings.targets.map(({ label, value }) => (
            <SimulatorButton
              key={value}
              label={label}
              onChange={onChangeOptions}
              setValueObject={{ ...options, target: value }}
              active={options.target === value}
            />
          ))}
        </li>
        <li className="simulator-grid-col">
          {settings.fonts
            .filter(({ styles }) => styles.includes(options.style))
            .map(({ label, value }) => (
              <SimulatorButton
                key={value}
                label={label}
                onChange={onChangeOptions}
                setValueObject={{ ...options, font: value }}
                active={options.font === value}
              />
            ))}
        </li>
        <li className="simulator-grid-col">
          {settings.directions.map(({ label, vertical }) => (
            <SimulatorButton
              key={label}
              label={label}
              onChange={onChangeOptions}
              setValueObject={{ ...options, vertical }}
              active={options.vertical === vertical}
            />
          ))}
        </li>
        <li className="simulator-grid-col">
          {weights.map((weight) => (
            <SimulatorButton
              label={`w${String(weight)}`}
              onChange={onChangeOptions}
              setValueObject={{ ...options, weight: Number(weight) }}
              active={options.weight === Number(weight)}
              key={weight}
            />
          ))}
        </li>
        <li className="simulator-grid-col">
          {sizes.map((size) => (
            <SimulatorButton
              label={size}
              onChange={onChangeOptions}
              setValueObject={{ ...options, size: size }}
              active={options.size === size}
              key={size}
            />
          ))}
        </li>
      </ul>
      <ul className={clsx("simulator-grid is-previews")}>
        <li className="simulator-grid-col">
          <p className="simulator-preview-label">{settings.labels.before}</p>
          <div
            className="simulator-preview-wrap"
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
              className="simulator-preview is-edit"
              style={textBeforeStyles}
            />
          </div>
        </li>
        <li className="simulator-grid-col">
          <p className="simulator-preview-label">{settings.labels.after}</p>
          <div
            className="simulator-preview-wrap"
            style={{
              writingMode: options.vertical ? "vertical-rl" : undefined,
            }}
          >
            <p className="simulator-preview" style={textAfterStyles}>
              {text}
            </p>
          </div>
        </li>
      </ul>
      <div
        className="simulator-code"
        dangerouslySetInnerHTML={{
          __html: codeExamples[getExampleKey(options)],
        }}
      />
    </div>
  )
}

function SimulatorButton({
  label,
  onChange,
  setValueObject,
  active,
}: {
  label: string
  onChange: (value: Options) => void
  setValueObject: Options
  active: boolean
}) {
  return (
    <button
      onClick={() => onChange(setValueObject)}
      className={clsx("simulator-button", active && "is-active")}
      type="button"
    >
      {label}
    </button>
  )
}
