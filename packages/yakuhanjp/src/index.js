//----------------------------------------------------
// Variables
//----------------------------------------------------

const fs = require("fs")
const sass = require("sass")

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"))
const pjt = JSON.parse(fs.readFileSync("./project.json", "utf8"))
const tmp = fs.readFileSync("./src/template.scss", "utf8")

const distScssDir = "./dist/scss"
const distCssDir = "./dist/css"
const distFontDir = "./dist/fonts"

//----------------------------------------------------
// Functions
//----------------------------------------------------

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const glyphs2unicode = (glyphs) => {
  const splitGlyphs = glyphs.split("")
  const arrayUnicode = []
  splitGlyphs.forEach((str) => {
    arrayUnicode.push(str2unicode(str))
  })
  arrayUnicode.sort()
  const joinUnicode = arrayUnicode.join()
  return joinUnicode
}

const str2unicode = (str) => {
  return "U+" + ("000" + str.charCodeAt(0).toString(16)).substr(-4)
}

const weights2scssWeights = (weights) => {
  const arrayWeights = []
  Object.keys(weights).forEach((key) => {
    arrayWeights.push(`${key}:"${weights[key]}"`)
  })
  const joinWeights = arrayWeights.join()
  return joinWeights
}

//----------------------------------------------------
// Actions
//----------------------------------------------------

createDir(distScssDir)
createDir(distCssDir)
createDir(distFontDir)

pjt.fonts.forEach((font) => {
  const distScss = `${distScssDir}/${font.dist.name}.scss`
  const distCss = `${distCssDir}/${font.dist.name}.css`
  const distCssMin = `${distCssDir}/${font.dist.name}.min.css`

  const unicode = glyphs2unicode(font.glyphs)
  const scssWeights = weights2scssWeights(font.weights)

  data = tmp.replace(/___pjtName___/g, pjt.name)
  data = data.replace(/___pkgVersion___/g, pkg.version)
  data = data.replace(/___pkgLicense___/g, pkg.license)
  data = data.replace(/___pkgAuthorName___/g, pkg.author.name)
  data = data.replace(/___fontName___/g, font.name)
  data = data.replace(/___fontBase___/g, font.base)
  data = data.replace(/___fontDistVariable___/g, font.dist.variable)
  data = data.replace(/___fontFile___/g, font.file)
  data = data.replace(/___unicode___/g, unicode)
  data = data.replace(/___weights___/g, scssWeights)

  const resultCss = sass.renderSync({
    data: data,
    outputStyle: "expanded",
  })
  const resultCssMin = sass.renderSync({
    data: data,
    outputStyle: "compressed",
  })

  fs.writeFileSync(distScss, data)
  fs.writeFileSync(distCss, resultCss.css)
  fs.writeFileSync(distCssMin, resultCssMin.css)
})
