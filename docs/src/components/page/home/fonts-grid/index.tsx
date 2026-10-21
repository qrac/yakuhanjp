import classNames from "classnames"

import pjt from "yakuhanjp/project.json"
import "./style.css"

export default function PageHomeFontsGrid() {
  const generalFonts = pjt.fonts.filter((font) => !font.specific.edition)
  return (
    <ul className="fonts-grid">
      {generalFonts.map((font, index) => (
        <li className="fonts-grid-col" key={index}>
          <h3 className="fonts-grid-title">{font.name}</h3>
          <h4 className="fonts-grid-description is-yakuhanjp">
            <span>{font.style.name}</span>
            <span>{`（${font.target.name}）`}</span>
          </h4>
          <p
            className={classNames(
              "fonts-grid-glyphs",
              `is-${font.dist.variable}`,
            )}
          >
            {font.glyphs}
          </p>
        </li>
      ))}
    </ul>
  )
}
