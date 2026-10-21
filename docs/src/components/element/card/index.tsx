import type { Props } from "./props"
import "./style.css"

export default function ElementCard({ children, endCover }: Props) {
  return (
    <div className="card">
      {children}
      {endCover && <div className="card-end-cover">{endCover}</div>}
    </div>
  )
}
