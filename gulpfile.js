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
  public: {
    dir: pjt.setting.public + "/",
    html: pjt.setting.public + "/",
    css: pjt.setting.public + "/",
    font: pjt.setting.public + "/fonts/"
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
    baseDir: paths.public.html
  },
  startPath: "index.html",
  open: false,
  notify: false
}

//----------------------------------------------------
// gulp: Task
//----------------------------------------------------

// Nunjucks > HTML (public)
gulp.task("nunjucks_public", () => {
  return gulp
    .src("index.njk")
    .pipe(
      data(function() {
        return { pkg, pjt }
      })
    )
    .pipe(nunjucks())
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest(paths.public.html))
})

// SCSS > CSS (public)
gulp.task("scss_public", () => {
  return gulp
    .src(paths.src.scss + "**/*.scss")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sass(sassOptions))
    .pipe(gulpif(banner.visible, header(banner.basic, { pkg, pjt })))
    .pipe(gulp.dest(paths.public.css))
})

// Copy Fonts (public)
gulp.task("copy_fonts_public", () => {
  return gulp.src(paths.dist.font + "**/*").pipe(gulp.dest(paths.public.font))
})

// SCSS > CSS
gulp.task("scss", () => {
  return gulp
    .src(paths.src.scss + "**/*.scss")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sass(sassOptions))
    .pipe(gulpif(banner.visible, header(banner.basic, { pkg, pjt })))
    .pipe(gulp.dest(paths.dist.css))
})

// CSS Minify
gulp.task("cssmin", () => {
  return gulp
    .src([paths.dist.css + "**/*.css", "!" + paths.dist.css + "**/*.min.css"])
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.dist.css))
})

// Browser Sync
gulp.task("browser-sync", function(done) {
  browserSync.init(browserSyncOptions)
  done()
})

gulp.task("reload", function(done) {
  browserSync.reload()
  done()
})

// Watch
gulp.task("watch", () => {
  gulp.watch("index.njk", gulp.series("nunjucks_public", "reload"))
  gulp.watch(paths.src.scss + "**/*.scss", gulp.series("scss_public", "reload"))
})

//----------------------------------------------------
// gulp: Default
//----------------------------------------------------

gulp.task(
  "default",
  gulp.series(
    gulp.parallel("nunjucks_public", "scss_public", "copy_fonts_public"),
    gulp.parallel("browser-sync", "watch")
  )
)

//----------------------------------------------------
// gulp: Public
//----------------------------------------------------

gulp.task(
  "public",
  gulp.series(
    gulp.parallel("nunjucks_public", "scss_public", "copy_fonts_public")
  )
)

//----------------------------------------------------
// gulp: Build
//----------------------------------------------------

gulp.task("build", gulp.parallel(gulp.series("scss", "cssmin")))
