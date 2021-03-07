import React from "react"

import Logo from "../assets/svgs/logo.svg"

import yakuhanjpPkg from "yakuhanjp/package.json"
import pjt from "../../project.json"

export default function SectionHero() {
  return (
    <section className="hero" id="hero">
      <Logo className="logo" />
      <h1 className="logo-title">{pjt.site.title}</h1>
      <h2 className="sub-title">{pjt.site.shortDescription}</h2>
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
