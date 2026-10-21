import { useState, useRef, useId } from "react"
import clsx from "clsx"

import {
  getFontName,
  getFallbackFont,
  getExampleKey,
} from "../../../utils/simulator"
import type { Options, Props } from "./props"
import { getEditableText } from "./editable-text"
import { useGoogleFont } from "./use-google-font"
import "./style.css"

export default function PageHomeSimulator({ settings, codeExamples }: Props) {
  const { defaultText, weights, sizes, googleFonts: googleFontsList } = settings
  const [text, setText] = useState(defaultText)
  // React owns the initial text; the browser owns subsequent edits so that
  // option changes and IME input do not move the caret or reset composition.
  const initialText = useRef(defaultText).current
  const previewId = useId()

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

  useGoogleFont(googleFontsList, options)

  return (
    <div className="simulator">
      <div className="simulator-grid is-buttons">
        <div className="simulator-grid-col" role="group" aria-label="書体">
          {settings.styles.map(({ label, style, font }) => (
            <SimulatorButton
              key={style}
              label={label}
              onChange={onChangeOptions}
              setValueObject={{ ...options, style, font }}
              active={options.style === style}
            />
          ))}
        </div>
        <div
          className="simulator-grid-col"
          role="group"
          aria-label="半角にする約物"
        >
          {settings.targets.map(({ label, value }) => (
            <SimulatorButton
              key={value}
              label={label}
              onChange={onChangeOptions}
              setValueObject={{ ...options, target: value }}
              active={options.target === value}
            />
          ))}
        </div>
        <div className="simulator-grid-col" role="group" aria-label="フォント">
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
        </div>
        <div className="simulator-grid-col" role="group" aria-label="組み方向">
          {settings.directions.map(({ label, vertical }) => (
            <SimulatorButton
              key={label}
              label={label}
              onChange={onChangeOptions}
              setValueObject={{ ...options, vertical }}
              active={options.vertical === vertical}
            />
          ))}
        </div>
        <div className="simulator-grid-col" role="group" aria-label="ウェイト">
          {weights.map((weight) => (
            <SimulatorButton
              label={`w${String(weight)}`}
              onChange={onChangeOptions}
              setValueObject={{ ...options, weight: Number(weight) }}
              active={options.weight === Number(weight)}
              key={weight}
            />
          ))}
        </div>
        <div className="simulator-grid-col" role="group" aria-label="文字サイズ">
          {sizes.map((size) => (
            <SimulatorButton
              label={size}
              onChange={onChangeOptions}
              setValueObject={{ ...options, size: size }}
              active={options.size === size}
              key={size}
            />
          ))}
        </div>
      </div>
      <ul className={clsx("simulator-grid is-previews")}>
        <li className="simulator-grid-col">
          <p className="simulator-preview-label" id={`${previewId}-before`}>
            {settings.labels.before}
          </p>
          <p className="simulator-sr-only" id={`${previewId}-help`}>
            テキストを編集すると、Afterにも同じ内容が反映されます。
          </p>
          <div
            className="simulator-preview-wrap"
            style={{
              writingMode: options.vertical ? "vertical-rl" : undefined,
            }}
          >
            <div
              contentEditable="plaintext-only"
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-labelledby={`${previewId}-before`}
              aria-describedby={`${previewId}-help`}
              onInput={(e: React.FormEvent<HTMLDivElement>) => {
                const target = e.currentTarget
                setText(getEditableText(target))
              }}
              className="simulator-preview is-edit"
              style={textBeforeStyles}
            >
              {initialText}
            </div>
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
      aria-pressed={active}
    >
      {label}
    </button>
  )
}
