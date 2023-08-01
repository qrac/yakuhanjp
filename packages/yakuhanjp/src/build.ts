import path from "node:path"
import fs from "fs-extra"
import * as sass from "sass"

type ImportedJson = {
  [key: string]: any
}
type ProjectFont = {
  name: string
  file: string
  base: string
  dist: {
    name: string
    variable: string
  }
  style: {
    name: string
    variable: string
  }
  target: {
    name: string
    variable: string
    small: true
  }
  specific: {
    name: string
    variable: string
    edition: boolean
  }
  glyphs: string
  weights: {
    [key: string]: string
  }
}

function str2unicode(str: string) {
  const hexStr = "000" + str.charCodeAt(0).toString(16)
  return "U+" + hexStr.substring(hexStr.length - 4)
}

function glyphs2unicode(glyphs: string) {
  const splitedGlyphs = glyphs.split("")
  return splitedGlyphs
    .map((item) => str2unicode(item))
    .sort()
    .join()
}

function weights2scssWeights(weights: { [key: string]: string }) {
  return Object.keys(weights)
    .map((key) => `${key}:"${weights[key]}"`)
    .join()
}

async function main() {
  const cwd = process.cwd()

  const pkg: ImportedJson = JSON.parse(
    await fs.readFile("./package.json", "utf8")
  )
  const pjt: ImportedJson = JSON.parse(
    await fs.readFile("./project.json", "utf8")
  )
  const tmp = await fs.readFile("./src/template.scss", "utf8")

  await Promise.all(
    pjt.fonts.map(async (item: ProjectFont) => {
      const distScss = path.join(cwd, "dist/scss", `${item.dist.name}.scss`)
      const distCss = path.join(cwd, "dist/css", `${item.dist.name}.css`)
      const distCssMin = path.join(cwd, "dist/css", `${item.dist.name}.min.css`)

      const unicode = glyphs2unicode(item.glyphs)
      const scssWeights = weights2scssWeights(item.weights)

      const data = tmp
        .replace(/___pjtName___/g, pjt.name)
        .replace(/___pkgVersion___/g, pkg.version)
        .replace(/___pkgLicense___/g, pkg.license)
        .replace(/___pkgAuthorName___/g, pkg.author.name)
        .replace(/___fontName___/g, item.name)
        .replace(/___fontBase___/g, item.base)
        .replace(/___fontDistVariable___/g, item.dist.variable)
        .replace(/___fontFile___/g, item.file)
        .replace(/___unicode___/g, unicode)
        .replace(/___weights___/g, scssWeights)

      const resultCss = sass.compileString(data, {
        style: "expanded",
      })
      const resultCssMin = sass.compileString(data, {
        style: "compressed",
      })

      await fs
        .outputFile(distScss, data)
        .then(() => {
          console.log(distScss.replace(cwd, ""))
        })
        .catch((err) => {
          console.error(err)
        })
      await fs
        .outputFile(distCss, resultCss.css)
        .then(() => {
          console.log(distCss.replace(cwd, ""))
        })
        .catch((err) => {
          console.error(err)
        })
      await fs
        .outputFile(distCssMin, resultCssMin.css)
        .then(() => {
          console.log(distCssMin.replace(cwd, ""))
        })
        .catch((err) => {
          console.error(err)
        })
    })
  )

  const files: string[] = pjt.fonts
    .map((item: ProjectFont) => item.file)
    .reduce((unique: string[], item: string) => {
      return unique.includes(item) ? unique : [...unique, item]
    }, [])

  await Promise.all(
    files.map(async (item) => {
      const distFonts = path.join(cwd, "dist/fonts", item)
      await fs
        .copy(path.join(cwd, "../core", item, "export/woff2"), distFonts)
        .then(() => {
          console.log(distFonts.replace(cwd, ""))
        })
        .catch((err) => {
          console.error(err)
        })
    })
  )
}

await main()
