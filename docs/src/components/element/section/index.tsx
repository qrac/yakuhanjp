import type { Props } from "./props"
import "./style.css"

export default function ElementSection({ id, heading, children }: Props) {
  return (
    <section className="section" id={id}>
      <div className="section-inner">
        {heading && <h2 className="section-heading">{heading}</h2>}
        {children}
      </div>
    </section>
  )
}
