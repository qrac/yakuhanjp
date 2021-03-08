import React from "react"

import yakuhanjpPjt from "yakuhanjp/project.json"

export default function SectionFonts() {
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
              <h4 className="descriptopn">
                {`${font.style.name} （${font.target.name}）`}
              </h4>
              <p className="glyphs">{font.glyphs}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
