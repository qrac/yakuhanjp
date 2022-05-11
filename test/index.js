import sass from "sass"

const tmp = "./test/index.scss"

const resultCss = sass.compile(tmp, {
  outputStyle: "expanded",
  includePaths: ["dist"],
})

console.log(resultCss.css.toString())
