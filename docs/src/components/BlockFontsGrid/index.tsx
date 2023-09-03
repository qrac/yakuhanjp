import classNames from "classnames"

import pjt from "yakuhanjp/project.json"

export default function () {
  const generalFonts = pjt.fonts.filter((font) => !font.specific.edition)
  return (
    <ul className="block-fonts-grid">
      {generalFonts.map((font, index) => (
        <li className="block-fonts-grid-col" key={index}>
          <h3 className="block-fonts-grid-title">{font.name}</h3>
          <h4 className="block-fonts-grid-descriptopn is-yakuhanjp">
            <span>{font.style.name}</span>
            <span>{`（${font.target.name}）`}</span>
          </h4>
          <p
            className={classNames(
              "block-fonts-grid-glyphs",
              `is-${font.dist.variable}`
            )}
          >
            {font.glyphs}
          </p>
        </li>
      ))}
    </ul>
  )
}
