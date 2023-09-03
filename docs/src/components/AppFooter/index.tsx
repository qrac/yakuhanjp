import site from "../../assets/data/site.json"

export default function () {
  const copyright = site.copyright
  const startYear = copyright.startYear
  const nowYear = new Date().getFullYear()
  const rangeYear =
    startYear === nowYear
      ? String(nowYear)
      : `${String(startYear)} - ${String(nowYear)}`
  return (
    <footer className="app-footer">
      <p className="app-footer-copyright">
        {"©️ "}
        {copyright.url ? (
          <a href={copyright.url}>{copyright.name}</a>
        ) : (
          <span>{copyright.name}</span>
        )}
        {` ${rangeYear}`}
      </p>
    </footer>
  )
}
