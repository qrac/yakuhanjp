//----------------------------------------------------
// Gulp > npx gulp
//----------------------------------------------------

const gulp = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')

// Setting : Paths
const paths = {
  'src_pug': './src/pug/',
  'src_scss': './src/scss/',
  'src_js': './src/js/',
  'src_img': './src/img/',
  'out_html': './',
  'out_css': './docs/css/',
  'out_js': './docs/js/',
  'out_img': './docs/img/',
  'yakuhanjp_css': './dist/css/'
}

// Setting : Pug Options
const pugOptions = {
  pretty: true
}

// Setting : Sass Options
const sassOptions = {
  outputStyle: 'expanded'
}

// Pug > HTML
gulp.task('pug', () => {
  return gulp.src([paths.src_pug + '**/*.pug', '!' + paths.src_pug + '**/_*.pug'])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(paths.out_html));
});

// Sass > CSS
gulp.task('scss', () => {
  return gulp.src(paths.src_scss + '**/*.scss')
    .pipe(sassGlob())
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sass(sassOptions))
    .pipe(autoprefixer(['> 3% in JP', 'ie 11', 'android 4.4', 'last 1 versions']))
    .pipe(gcmq())
    .pipe(gulp.dest(paths.out_css))
});

// CSS Minify
gulp.task('cssmin', () => {
  return gulp.src([paths.out_css + '**/*.css', '!' + paths.out_css + '**/*.min.css'])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.out_css))
});

// CSS Minify (Yaku Han JP)
gulp.task('cssmin_yakuhanjp', () => {
  return gulp.src([paths.yakuhanjp_css + '**/*.css', '!' + paths.yakuhanjp_css + '**/*.min.css'])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.yakuhanjp_css))
});

// JS Concat & Babel
gulp.task('jsconcat', () => {
  return gulp.src(paths.src_js + '**/*.js')
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(concat('app.js'))
    .pipe(babel({
      'presets': [
        ['env', {
          'targets': {
            'browsers': ['> 3% in JP', 'ie 11', 'android 4.4', 'last 1 versions']
          }
        }]
      ]
    }))
    .pipe(gulp.dest(paths.out_js))
});

// JS Uglify
gulp.task('jsuglify', () => {
  return gulp.src([paths.out_js + '**/*.js', '!' + paths.out_js + '**/*.min.js'])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.out_js))
});

// Image Optimize
gulp.task('imagemin', () => {
  return gulp.src(paths.src_img + '*')
    .pipe(imagemin([
      pngquant({ quality: 100, speed: 3 }),
      imagemin.jpegtran({ quality: 85, progressive: true}),
      imagemin.svgo(),
      imagemin.gifsicle()
    ]))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.out_img))
})

// Browser Sync
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: paths.out_html
    }
  });
  gulp.watch(paths.out_html + '**/*.html', ['reload']);
  gulp.watch(paths.out_css + '**/*.min.css', ['reload']);
  gulp.watch(paths.out_js + '**/*.min.js', ['reload']);
  gulp.watch(paths.out_img + '*', ['reload']);
});

gulp.task('reload', () => {
  browserSync.reload();
});

// Watch
gulp.task('watch', () => {
  gulp.watch([paths.src_pug + '**/*.pug', '!' + paths.src_pug + '**/_*.pug'], ['pug']);
  gulp.watch(paths.src_scss + '**/*.scss', ['scss']);
  gulp.watch(paths.src_js + '**/*.js', ['jsconcat']);
  gulp.watch(paths.src_img + '*', ['imagemin']);
  gulp.watch([paths.out_css + '**/*.css', '!' + paths.out_css + '**/*.min.css'], ['cssmin']);
  gulp.watch([paths.out_js + '**/*.js', '!' + paths.out_js + '**/*.min.js'], ['jsuglify']);
  gulp.watch([paths.yakuhanjp_css + '**/*.css', '!' + paths.yakuhanjp_css + '**/*.min.css'], ['cssmin_yakuhanjp']);
});

gulp.task('default', ['browser-sync', 'watch']);