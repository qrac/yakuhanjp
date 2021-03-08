import React from "react"

import Logo from "../assets/svgs/logo.svg"
import LogoText from "../assets/svgs/logo-text.svg"

import yakuhanjpPkg from "yakuhanjp/package.json"
import pjt from "../../project.json"

export default function SectionHero() {
  return (
    <section className="hero" id="hero">
      <Logo className="logo" />
      <LogoText className="logo-text" />
      <h1 className="sub-title">{pjt.site.shortDescription}</h1>
      <p className="repo-note">
        <span>v{yakuhanjpPkg.version}</span>
        <span>{" / "}</span>
        <span>{yakuhanjpPkg.license}</span>
        <span>{" / "}</span>
        <a href={pjt.site.github.url}>Repository</a>
        <span>{" / "}</span>
        <a href={pjt.site.github.url + "/releases"}>Releases</a>
      </p>
    </section>
  )
}
