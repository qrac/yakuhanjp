//----------------------------------------------------
// Variables
//----------------------------------------------------

const fs = require("fs-extra")
const sass = require("sass")

const tmp = fs.readFileSync("./test/index.scss", "utf8")

//----------------------------------------------------
// Actions
//----------------------------------------------------

const resultCss = sass.renderSync({
  data: tmp,
  outputStyle: "expanded",
  includePaths: ["dist"],
})

console.log(resultCss.css.toString())
