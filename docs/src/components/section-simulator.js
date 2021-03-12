import React, { useState, useEffect } from "react"
import classNames from "classnames"

import TextareaAutosize from "react-textarea-autosize"

import yakuhanjpPkg from "yakuhanjp/package.json"
import pjt from "../../project.json"

const SectionSimulator = () => {
  const [isDark, setIsDark] = useState(false)
  const [isReverse, setIsReverse] = useState(false)
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
  const onChangeIsReverse = (value) => setIsReverse(value)
  const onChangeOptions = (value) => setOptions(value)
  const onChangeText = (event) => {
    setText(event.target.value)
  }
  useEffect(() => {
    window.matchMedia("(prefers-color-scheme: dark)").matches && setIsDark(true)
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (event.matches) {
          //console.log("change dark")
          setIsDark(true)
          setIsReverse(false)
        } else {
          //console.log("change light")
          setIsDark(false)
          setIsReverse(false)
        }
      })
  }, [])
  const switchFontYakuHan = ({ callFileName }) => {
    switch (true) {
      case options.style === "sans-serif" &&
        options.target === "small" &&
        options.font !== "yu" &&
        options.font !== "noto" &&
        options.font !== "apple":
        return callFileName ? "yakuhanjp_s" : "YakuHanJPs"
      case options.style === "serif" &&
        options.target === "all" &&
        options.font !== "noto":
        return callFileName ? "yakuhanmp" : "YakuHanMP"
      case options.style === "serif" &&
        options.target === "small" &&
        options.font !== "noto":
        return callFileName ? "yakuhanmp_s" : "YakuHanMPs"
      case options.style === "rounded-sans-serif" && options.target === "all":
        return callFileName ? "yakuhanrp" : "YakuHanRP"
      case options.style === "rounded-sans-serif" && options.target === "small":
        return callFileName ? "yakuhanrp_s" : "YakuHanRPs"
      case options.style === "sans-serif" &&
        options.target === "all" &&
        options.font === "noto":
        return callFileName ? "yakuhanjp-noto" : "YakuHanJP_Noto"
      case options.style === "sans-serif" &&
        options.target === "small" &&
        options.font === "noto":
        return callFileName ? "yakuhanjp_s-noto" : "YakuHanJPs_Noto"
      case options.style === "serif" &&
        options.target === "all" &&
        options.font === "noto":
        return callFileName ? "yakuhanmp-noto" : "YakuHanMP_Noto"
      case options.style === "serif" &&
        options.target === "small" &&
        options.font === "noto":
        return callFileName ? "yakuhanmp_s-noto" : "YakuHanMPs_Noto"
      case options.style === "sans-serif" &&
        options.target === "all" &&
        options.font === "yu":
      case options.style === "sans-serif" &&
        options.target === "all" &&
        options.font === "apple":
        return callFileName ? "yakuhanjp-narrow" : "YakuHanJP_Narrow"
      case options.style === "sans-serif" &&
        options.target === "small" &&
        options.font === "yu":
      case options.style === "sans-serif" &&
        options.target === "small" &&
        options.font === "apple":
        return callFileName ? "yakuhanjp_s-narrow" : "YakuHanJPs_Narrow"
      default:
        return callFileName ? "yakuhanjp" : "YakuHanJP"
    }
  }
  const switchFontFallback = () => {
    switch (true) {
      case options.style === "sans-serif" && options.font === "apple":
        return `-apple-system, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
      case options.style === "sans-serif" && options.font === "yu":
        return `"Yu Gothic Medium", "Yu Gothic", YuGothic, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
      case options.style === "sans-serif" && options.font === "noto":
        return `"Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif`
      case options.style === "serif" && options.font === "hiragino":
        return `"Hiragino Mincho ProN", "Noto Serif JP", "Yu Mincho", YuMincho, serif`
      case options.style === "serif" && options.font === "yu":
        return `"Yu Mincho", YuMincho, "Hiragino Mincho ProN", "Noto Serif JP", serif`
      case options.style === "serif" && options.font === "noto":
        return `"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", YuMincho, serif`
      case options.style === "rounded-sans-serif" &&
        options.font === "mplusr1c":
        return `"M PLUS Rounded 1c", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
      default:
        return `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
    }
  }
  const switchFonts = switchFontFallback()
  const switchFontsWithYakuHan = [
    switchFontYakuHan({ callFileName: false }),
    switchFontFallback(),
  ].join(", ")
  const textBeforeStyles = {
    fontSize: options.size,
    fontWeight: Number(options.weight),
    fontFamily: switchFonts,
  }
  const textAfterStyles = {
    fontSize: options.size,
    fontWeight: Number(options.weight),
    fontFamily: switchFontsWithYakuHan,
  }
  return (
    <section className="section" id="simulator">
      <div className="inner">
        <h2 className="heading">{"Simulator"}</h2>
        <div className="simulator">
          <SimulatorMode
            isDark={isDark}
            isReverse={isReverse}
            onChange={onChangeIsReverse}
          />
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
          <ul
            className={classNames(
              "simulator-grid is-previews",
              isReverse && "is-reverse"
            )}
          >
            <li className="col">
              <label
                className="simulator-preview-label"
                htmlFor="simulator-preview-before"
              >
                {"Before"}
              </label>
              <TextareaAutosize
                className="simulator-preview"
                id="simulator-preview-before"
                style={textBeforeStyles}
                value={text}
                onChange={onChangeText}
                minRows={1}
              />
            </li>
            <li className="col">
              <label
                className="simulator-preview-label"
                htmlFor="simulator-preview-after"
              >
                {"After"}
              </label>
              <TextareaAutosize
                className="simulator-preview"
                id="simulator-preview-after"
                style={textAfterStyles}
                value={text}
                onChange={onChangeText}
                minRows={1}
              />
            </li>
          </ul>
          <SimulatorCode
            fileName={switchFontYakuHan({ callFileName: true })}
            override={switchFontYakuHan({ callFileName: false })}
            fallback={switchFontFallback()}
          />
        </div>
      </div>
    </section>
  )
}

const SimulatorMode = ({ isDark, isReverse, onChange }) => {
  return !isDark ? (
    <div className="simulator-mode">
      <button
        onClick={() => onChange(false)}
        className={classNames(
          "simulator-mode-button",
          !isReverse && "is-active"
        )}
        type="button"
      >
        {"Light"}
      </button>
      <span>{"|"}</span>
      <button
        onClick={() => onChange(true)}
        className={classNames(
          "simulator-mode-button",
          isReverse && "is-active"
        )}
        type="button"
      >
        {"Dark"}
      </button>
    </div>
  ) : (
    <div className="simulator-mode">
      <button
        onClick={() => onChange(true)}
        className={classNames(
          "simulator-mode-button",
          isReverse && "is-active"
        )}
        type="button"
      >
        {"Light"}
      </button>
      <span>{"|"}</span>
      <button
        onClick={() => onChange(false)}
        className={classNames(
          "simulator-mode-button",
          !isReverse && "is-active"
        )}
        type="button"
      >
        {"Dark"}
      </button>
    </div>
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

const SimulatorCode = ({ fileName, override, fallback }) => {
  const codeTemplate = `<code><span class="token comment">&lt;!-- HTML：CDNリンクを貼り付け --&gt;</span>
&lt;<span class="token tag">link</span> <span class="token attr-name">rel</span>="<span class="token attr-value">stylesheet</span>" <span class="token attr-name">href</span>="<span class="token attr-value">https://cdn.jsdelivr.net/npm/yakuhanjp@${yakuhanjpPkg.version}/dist/css/${fileName}.min.css</span>"&gt;

<span class="token comment">// CSS：font-familyを設定</span>
<span class="token attr-name">.example</span> {
  font-family: <span class="token keyword">${override}</span>, <span class="token attr-value">${fallback}</span>;
}</code>`
  return (
    <div className="simulator-code">
      {/* prettier-ignore */}
      <pre dangerouslySetInnerHTML={{ __html: codeTemplate }} />
    </div>
  )
}

export default SectionSimulator
