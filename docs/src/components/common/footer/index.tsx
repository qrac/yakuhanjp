import type { Props } from "./props"
import "./style.css"

export default function CommonFooter({
  copyrightSince,
  copyrightHolder,
  copyrightUrl,
}: Props) {
  return (
    <footer className="footer">
      <p className="footer-copyright">
        <span>© {copyrightSince}-present </span>
        <a href={copyrightUrl}>{copyrightHolder}</a>
      </p>
    </footer>
  )
}
