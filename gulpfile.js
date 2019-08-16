//----------------------------------------------------
// gulp: Setting
//----------------------------------------------------

const gulp = require("gulp")
const fs = require("fs")
const notify = require("gulp-notify")
const plumber = require("gulp-plumber")
const rename = require("gulp-rename")
const header = require("gulp-header")
const gulpif = require("gulp-if")
const nunjucks = require("gulp-nunjucks-render")
const data = require("gulp-data")
const htmlBeautify = require("gulp-html-beautify")
const sass = require("gulp-sass")
const cleanCSS = require("gulp-clean-css")
const browserSync = require("browser-sync")

// Read File
const files = {
  pkg: "./package.json",
  pjt: "./project.json"
}
const pkg = JSON.parse(fs.readFileSync(files.pkg))
const pjt = JSON.parse(fs.readFileSync(files.pjt))

// Banner
const banner = {
  basic: [
    "/*! <%= pjt.setting.name %> v<%= pkg.version %> <%= pkg.license %> by <%= pkg.author.name %> */",
    ""
  ].join("\n"),
  visible: pjt.setting.banner
}

// Paths
const paths = {
  dist: {
    dir: pjt.setting.dist + "/",
    css: pjt.setting.dist + "/css/",
    font: pjt.setting.dist + "/fonts/"
  },
  test: {
    dir: pjt.setting.test + "/",
    html: pjt.setting.test + "/",
    css: pjt.setting.test + "/",
    font: pjt.setting.test + "/fonts/"
  },
  src: {
    dir: pjt.setting.src + "/",
    scss: pjt.setting.src + "/scss/"
  }
}

const htmlBeautifyOptions = {
  indent_size: 2,
  max_preserve_newlines: 0,
  indent_inner_html: true,
  extra_liners: []
}

// Sass Options
const sassOptions = {
  outputStyle: "expanded",
  includePaths: "./node_modules/"
}

// BrowserSync Options
const browserSyncOptions = {
  server: {
    baseDir: paths.test.html
  },
  startPath: "index.html",
  open: false,
  notify: false
}

//----------------------------------------------------
// gulp: Task
//----------------------------------------------------

// Nunjucks > HTML (test)
function htmlTest() {
  return gulp
    .src("index.njk")
    .pipe(
      data(function() {
        return { pkg, pjt }
      })
    )
    .pipe(nunjucks())
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest(paths.test.html))
}

// SCSS > CSS (Test)
function scssTest() {
  return gulp
    .src(paths.src.scss + "**/*.scss")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sass(sassOptions))
    .pipe(gulpif(banner.visible, header(banner.basic, { pkg, pjt })))
    .pipe(gulp.dest(paths.test.css))
}

// Copy Fonts (test)
function copyFontsTest() {
  return gulp.src(paths.dist.font + "**/*").pipe(gulp.dest(paths.test.font))
}

// SCSS > CSS (Build)
function scssBuild() {
  return gulp
    .src(paths.src.scss + "**/*.scss")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sass(sassOptions))
    .pipe(gulpif(banner.visible, header(banner.basic, { pkg, pjt })))
    .pipe(gulp.dest(paths.dist.css))
}

// CSS Minify
function cssMin() {
  return gulp
    .src([paths.dist.css + "**/*.css", "!" + paths.dist.css + "**/*.min.css"])
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.dist.css))
}

// BrowserSync Init
function browserSyncInit(done) {
  browserSync.init(browserSyncOptions)
  done()
}

// BrowserSync Reload
function browserSyncReload(done) {
  browserSync.reload()
  done()
}

// Watch
function watchFiles() {
  gulp.watch("index.njk",
    gulp.series(htmlTest, browserSyncReload)
  )
  gulp.watch(
    paths.src.scss + "**/*.scss",
    gulp.series(scssTest, browserSyncReload)
  )
}

//----------------------------------------------------
// gulp: Default
//----------------------------------------------------

gulp.task(
  "default",
  gulp.series(
    gulp.parallel(htmlTest, scssTest, copyFontsTest),
    gulp.parallel(browserSyncInit, watchFiles)
  )
)

//----------------------------------------------------
// gulp: test
//----------------------------------------------------

gulp.task(
  "test",
  gulp.series(gulp.parallel(htmlTest, scssTest, copyFontsTest))
)

//----------------------------------------------------
// gulp: Build
//----------------------------------------------------

gulp.task("build", gulp.parallel(gulp.series(scssBuild, cssMin)))
