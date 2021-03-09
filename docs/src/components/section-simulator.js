import React, { useState } from "react"
import classNames from "classnames"

import TextareaAutosize from "react-textarea-autosize"

//import yakuhanjpPkg from "yakuhanjp/package.json"
import pjt from "../../project.json"

const SectionSimulator = () => {
  const [options, setOptions] = useState({
    style: "sans-serif",
    target: "all",
    font: "hiragino",
    weight: 400,
    size: "1rem",
  })
  const [text, setText] = useState(pjt.site.dummyText)
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
  const onChangeOptions = (value) => setOptions(value)
  const onChangeText = (event) => {
    setText(event.target.value)
  }
  const switchHiragino = () => {
    switch (options.style) {
      case "serif":
        return `"Hiragino Mincho ProN", "Noto Serif JP", "Yu Mincho", YuMincho, serif`
      default:
        return `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
    }
  }
  const switchYu = () => {
    switch (options.style) {
      case "serif":
        return `"Yu Mincho", YuMincho, "Hiragino Mincho ProN", "Noto Serif JP", serif`
      default:
        return `"Yu Gothic Medium", "Yu Gothic", YuGothic, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
    }
  }
  const switchNoto = () => {
    switch (options.style) {
      case "serif":
        return `"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", YuMincho, serif`
      default:
        return `"Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif`
    }
  }
  const switchFontFallback = () => {
    switch (options.font) {
      case "yu":
        return switchYu()
      case "noto":
        return switchNoto()
      default:
        return switchHiragino()
    }
  }
  const switchFonts = switchFontFallback()
  const textBeforeStyles = {
    fontSize: options.size,
    fontWeight: Number(options.weight),
    fontFamily: switchFonts,
  }
  const textAfterStyles = {
    fontSize: options.size,
    fontWeight: Number(options.weight),
    fontFamily: switchFonts,
  }
  return (
    <section className="section" id="simulator">
      <div className="inner">
        <h2 className="heading">{"Simulator"}</h2>
        <div className="simulator">
          <ul className="simulator-grid is-buttons">
            <li className="col">
              <SimulatorButton
                label="Gothic"
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
                label="Mincho"
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
                label="Round"
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
            <li className="col">
              <SimulatorButton
                label="All"
                onChange={onChangeOptions}
                setValueObject={{ ...options, target: "all" }}
                active={options.target === "all"}
                show={true}
              />
              <SimulatorButton
                label="Small"
                onChange={onChangeOptions}
                setValueObject={{ ...options, target: "small" }}
                active={options.target === "small"}
                show={true}
              />
            </li>
            <li className="col">
              <SimulatorButton
                label="Hiragino"
                onChange={onChangeOptions}
                setValueObject={{ ...options, font: "hiragino" }}
                active={options.font === "hiragino"}
                show={
                  options.style === "sans-serif" || options.style === "serif"
                }
              />
              <SimulatorButton
                label="Apple"
                onChange={onChangeOptions}
                setValueObject={{ ...options, font: "apple" }}
                active={options.font === "apple"}
                show={options.style === "sans-serif"}
              />
              <SimulatorButton
                label="Yu"
                onChange={onChangeOptions}
                setValueObject={{ ...options, font: "yu" }}
                active={options.font === "yu"}
                show={
                  options.style === "sans-serif" || options.style === "serif"
                }
              />
              <SimulatorButton
                label="Noto"
                onChange={onChangeOptions}
                setValueObject={{ ...options, font: "noto" }}
                active={options.font === "noto"}
                show={
                  options.style === "sans-serif" || options.style === "serif"
                }
              />
              <SimulatorButton
                label="M PLUS Rounded 1c"
                onChange={onChangeOptions}
                setValueObject={{ ...options, font: "mplusr1c" }}
                active={options.font === "mplusr1c"}
                show={options.style === "rounded-sans-serif"}
              />
            </li>
            <li className="col">
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
            <li className="col">
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
          <ul className="simulator-grid is-previews">
            <li className="col">
              <TextareaAutosize
                className="simulator-preview"
                style={textBeforeStyles}
                value={text}
                onChange={onChangeText}
                minRows={1}
              />
            </li>
            <li className="col">
              <TextareaAutosize
                className="simulator-preview"
                style={textAfterStyles}
                value={text}
                onChange={onChangeText}
                minRows={1}
              />
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

const SimulatorButton = ({ label, onChange, setValueObject, active, show }) => {
  return (
    show && (
      <button
        onClick={() => onChange(setValueObject)}
        className={classNames("simulator-button", active && "is-active")}
        type="button"
      >
        {label}
      </button>
    )
  )
}

export default SectionSimulator
