const { src, dest, watch, series, parallel } = require("gulp");
const browsersync = require("browser-sync").create();

const gulp = require("gulp"); 
const fileinclude = require("gulp-file-include");
const del = require("del");
const scss = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const clean_css = require("gulp-clean-css");
const rename = require("gulp-rename");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-html");
const webpcss = require("gulp-webpcss");
const group_media = require("gulp-group-css-media-queries");
const imagemin = require("gulp-imagemin");
const fonter = require("gulp-fonter"); // Вместо gulp-ttf2woff2
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const eslint = require("gulp-eslint");
const zip = require("gulp-vinyl-zip");
const htmlmin = require("gulp-htmlmin");
const csscomb = require("gulp-csscomb");
const uglify = require("gulp-uglify");



const project_folder = "dist";
const source_folder = "#src";

const path = {
  build: {
    html: `${project_folder}/`,
    css: `${project_folder}/css/`,
    js: `${project_folder}/js/`,
    img: `${project_folder}/img/`,
    fonts: `${project_folder}/fonts/`,
  },
  src: {
    html: [`${source_folder}/*.html`, `!${source_folder}/_*.html`],
    css: `${source_folder}/scss/style.scss`,
    js: `${source_folder}/js/script.js`,
    img: `${source_folder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
    fonts: `${source_folder}/fonts/*.ttf`,
  },
  watch: {
    html: `${source_folder}/**/*.html`,
    css: `${source_folder}/scss/**/*.scss`,
    js: `${source_folder}/js/**/*.js`,
    img: `${source_folder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
  },
  clean: `./${project_folder}/`
};

function browserSync() {
  browsersync.init({
    server: { baseDir: `./${project_folder}/` },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(plumber({ errorHandler: notify.onError("Ошибка SCSS: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(scss({ outputStyle: "expanded" }))
    .pipe(group_media())
    .pipe(autoprefixer({ overrideBrowserslist: ["last 5 versions"], cascade: true }))
    .pipe(webpcss())
    .pipe(csscomb())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js, { allowEmpty: true }) // Добавил { allowEmpty: true } на случай пустых файлов
    .pipe(plumber({ errorHandler: notify.onError("Ошибка JS: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(fileinclude())
    .pipe(dest(path.build.js)) // Записываем оригинальный JS
    .pipe(uglify()) // Минифицируем
    .pipe(rename({ extname: ".min.js" }))
    .pipe(sourcemaps.write(".")) 
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}


function images() {
  return src(path.src.img)
    .pipe(webp())
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(imagemin({ progressive: true, interlaced: true, optimizationLevel: 5 }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function fonts() {
  return src(path.src.fonts)
    .pipe(fonter({ formats: ["woff", "woff2"] }))
    .pipe(dest(path.build.fonts));
}
function zipProject() {
  return src(`${project_folder}/**/*`)
    .pipe(zip("project.zip"))
    .pipe(dest("./"));
}

function clean() {
  return del(path.clean);
}

function watchFiles() {
  watch(path.watch.html, html);
  watch(path.watch.css, css);
  watch(path.watch.js, js);
  watch(path.watch.img, images);
}

let build = series(clean, parallel(js, css, html, images, fonts));
let dev = series(build, parallel(watchFiles, browserSync));

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = dev;
exports.default = dev;
exports.zip = zipProject;
