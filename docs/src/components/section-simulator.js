import React, { useState, useRef } from "react"
import classNames from "classnames"

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
  const changeOptions = (value) => setOptions(value)
  return (
    <section className="section" id="simulator">
      <div className="inner">
        <h2 className="heading">{"Simulator"}</h2>
        <div className="simulator">
          <ul className="simulator-grid is-buttons">
            <li className="col">
              <SimulatorButton
                label="Gothic"
                onChange={changeOptions}
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
                onChange={changeOptions}
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
                onChange={changeOptions}
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
                onChange={changeOptions}
                setValueObject={{ ...options, target: "all" }}
                active={options.target === "all"}
                show={true}
              />
              <SimulatorButton
                label="Small"
                onChange={changeOptions}
                setValueObject={{ ...options, target: "small" }}
                active={options.target === "small"}
                show={true}
              />
            </li>
            <li className="col">
              <SimulatorButton
                label="Hiragino"
                onChange={changeOptions}
                setValueObject={{ ...options, font: "hiragino" }}
                active={options.font === "hiragino"}
                show={
                  options.style === "sans-serif" || options.style === "serif"
                }
              />
              <SimulatorButton
                label="Apple"
                onChange={changeOptions}
                setValueObject={{ ...options, font: "apple" }}
                active={options.font === "apple"}
                show={options.style === "sans-serif"}
              />
              <SimulatorButton
                label="Yu"
                onChange={changeOptions}
                setValueObject={{ ...options, font: "yu" }}
                active={options.font === "yu"}
                show={
                  options.style === "sans-serif" || options.style === "serif"
                }
              />
              <SimulatorButton
                label="Noto"
                onChange={changeOptions}
                setValueObject={{ ...options, font: "noto" }}
                active={options.font === "noto"}
                show={
                  options.style === "sans-serif" || options.style === "serif"
                }
              />
              <SimulatorButton
                label="M PLUS Rounded 1c"
                onChange={changeOptions}
                setValueObject={{ ...options, font: "mplusr1c" }}
                active={options.font === "mplusr1c"}
                show={options.style === "rounded-sans-serif"}
              />
            </li>
            <li className="col">
              {weights.map((weight, index) => (
                <SimulatorButton
                  label={`w${String(weight)}`}
                  onChange={changeOptions}
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
                  onChange={changeOptions}
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
              <SimulatorPreviewEdit text={text} onChange={setText} />
            </li>
            <li className="col">
              <SimulatorPreview text={text} />
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

const SimulatorPreviewEdit = ({ text, onChange }) => {
  const defalutText = useRef(text)
  const handleInput = (event) => {
    onChange(event.target.innerHTML)
  }
  return (
    <div
      className={"simulator-preview"}
      contentEditable={true}
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: defalutText.current }}
    />
  )
}

const SimulatorPreview = ({ text }) => {
  return <div className={"simulator-preview"}>{text}</div>
}

export default SectionSimulator
