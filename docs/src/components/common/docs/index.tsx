import type { Props } from "./props"
import "./style.css"

export default function CommonDocs({ children }: Props) {
  return <section className="docs">{children}</section>
}
