import pkg from "yakuhanjp/package.json"

import site from "../../assets/data/site.json"
import { ReactComponent as SvgLogoIcon } from "../../assets/svgs/logo-icon.svg"
import { ReactComponent as SvgLogoText } from "../../assets/svgs/logo-text.svg"

export default function ({ id }: { id?: string }) {
  return (
    <section className="section-hero" id={id}>
      <SvgLogoIcon className="svg-logo-icon" />
      <h1>
        <SvgLogoText className="svg-logo-text" aria-label={site.title} />
      </h1>
      <h2 className="section-hero-description">{site.shortDescription}</h2>
      <p className="section-hero-note">
        <span>v{pkg.version}</span>
        <span>{" / "}</span>
        <span>{pkg.license}</span>
        <span>{" / "}</span>
        <a href={site.github.url}>Repository</a>
        <span>{" / "}</span>
        <a href={site.github.url + "/releases"}>Releases</a>
      </p>
    </section>
  )
}
