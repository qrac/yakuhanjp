import { Svg } from "minista/assets"

import type { Props } from "./props"
import "./style.css"

export default function PageHomeHero({
  id,
  name,
  description,
  version,
  license,
  repositoryUrl,
}: Props) {
  return (
    <section className="hero" id={id}>
      <Svg src="/src/assets/svgs/logo-icon.svg" className="svg-logo-icon" />
      <h1>
        <Svg
          src="/src/assets/svgs/logo-text.svg"
          className="svg-logo-text"
          aria-label={name}
        />
      </h1>
      <h2 className="hero-description">{description}</h2>
      <p className="hero-note">
        <span>v{version}</span>
        <span>{" / "}</span>
        <span>{license}</span>
        <span>{" / "}</span>
        <a href={repositoryUrl}>Repository</a>
        <span>{" / "}</span>
        <a href={repositoryUrl + "/releases"}>Releases</a>
      </p>
    </section>
  )
}
