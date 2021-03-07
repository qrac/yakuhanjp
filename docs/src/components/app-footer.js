import React from "react"

import yakuhanjpPkg from "yakuhanjp/package.json"
import pjt from "../../project.json"

const copylight = pjt.site.copylight
const nowYear = new Date().getFullYear()

export default function AppFooter() {
  return (
    <footer className="footer">
      <p className="copylight">
        {"©️ "}
        <a href={yakuhanjpPkg.organization.url}>
          {yakuhanjpPkg.organization.name}
        </a>
        {` ${copylight.startYear} - ${nowYear}`}
      </p>
    </footer>
  )
}
