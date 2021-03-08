import React from "react"
import classNames from "classnames"

import yakuhanjpPjt from "yakuhanjp/project.json"

const SectionFonts = () => {
  const generalFonts = yakuhanjpPjt.fonts.filter(
    (font) => !font.specific.edition
  )
  return (
    <section className="section" id="fonts">
      <div className="inner">
        <h2 className="heading">{"Fonts"}</h2>
        <ul className="fonts-grid">
          {generalFonts.map((font, index) => (
            <li className="col" key={index}>
              <h3 className="title">{font.name}</h3>
              <h4 className="descriptopn is-yakuhanjp">
                <span>{font.style.name}</span>
                <span>{`（${font.target.name}）`}</span>
              </h4>
              <p className={classNames("glyphs", `is-${font.dist.variable}`)}>
                {font.glyphs}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SectionFonts
