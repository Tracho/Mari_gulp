//const fileinclude = require('gulp-file-include');
//const del = require('del');
// cd FLS-Gulp
//npm rebuild node-sass --force 
//yarn gulp
let project_folder = "dist"; //Папка с готовым проектом на сдачу
let source_folder = "#src"; //Рабочая папка

let fs = require("fs"); // файл систем

const { src, dest,   series, parallel } = require('gulp');
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include"); // @@include('h.html') в html
const del = require("del");
// const scss = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const group_media = require("gulp-group-css-media-queries");
const clean_css = require("gulp-clean-css");
const rename = require("gulp-rename");
// const uglify = require("gulp-uglify-es").default;
// const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-html");
const svgSprite = require("gulp-svg-sprite");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
 
const fonter = require("gulp-fonter"); 
const purgecss = require('gulp-purgecss');
//const webpcss = require("gulp-webpcss"); 
const terser = require('gulp-terser'); 
 
const sass = require('gulp-sass')(require('sass')); // Explicitly set the Sass compiler
 
 
let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },

  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/**/*.js", // Update to include all JS files in the js folder and its subfolders
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*.ttf",
  },

  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    //fonts: source_folder + "/fonts/*.ttf",
  },
  clean: "./" + project_folder + "/",
};


function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return gulp
    .src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function images() {
  return gulp
    .src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3, //0 to 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function fonts() {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
  return gulp
    .src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
}

function css() {
  return (
    gulp
      .src(path.src.css)
      .pipe(
        sass({
          outputStyle: 'expanded',
        })
      )
      .pipe(group_media())
      .pipe(
        autoprefixer({
          overrideBrowserslist: ['last 5 versions'],
          cascade: true,
        })
      )
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(
        rename({
          extname: '.min.css',
        })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
  );
}

// function js() {
//   return gulp
//     .src(path.src.js)
//     .pipe(fileinclude())
//     .pipe(dest(path.build.js))
//     .pipe(
//       babel({
//         presets: ["@babel/env"],
//       })
//     )
//     .pipe(uglify())
//     .pipe(
//       rename({
//         extname: ".min.js",
//       })
//     )
//     .pipe(dest(path.build.js))
//     .pipe(browsersync.stream());
// }
function js() {
  return gulp.src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(terser())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

gulp.task('purgecss', () => {
  return gulp.src('./#src/css/bootstrap-grid.min.css') // Specify the path to your bootstrap-grid.css file
    .pipe(purgecss({
      content: ['./#src/html/*.html', './#src/html/modules/*.html'], 
    }))
    .pipe(gulp.dest(path.build.css)); // Specify the path to save the optimized file
});

gulp.task('default', gulp.series('purgecss'));
 

 


function fontsStyle(params) {
  let file_content = fs.readFileSync(source_folder + "/scss/fonts.scss");
  if (file_content == "") {
    fs.writeFile(source_folder + "/scss/fonts.scss", "", cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split(".");
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              source_folder + "/scss/fonts.scss",
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb
            );
          }
          c_fontname = fontname;
        }
      }
    });
  }
}
function cb(params) {}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean(params) {
  return del(path.clean);
}

gulp.task("svgSprite", function () {
  //gulp svgSprite запустить в другой консоли
  return gulp
    .src([source_folder + "/iconsprite/*.svg"])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../icons/icons.svg", //sprite file name
            //example:true
          },
        },
      })
    )
    .pipe(dest(path.build.img));
});
 

gulp.task("otf2ttf", function () {
  //gulp otf2ttf запустить в другой консоли
  return gulp
    .src([source_folder + "/fonts/*.otf"])
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(dest(source_folder + "/fonts/"));
});

let fontsBuild = gulp.series(clean, fonts, fontsStyle);
// let build = gulp.task('build', gulp.series('purgecss', gulp.parallel(js, css, html, images)));
let build = gulp.series(clean,gulp.series('purgecss'), gulp.parallel(js, css, html, images));
// let build = gulp.series(clean, gulp.series('purgecss'), gulp.parallel(js, css, html, images), measurePerformance);

let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.fontsBuild = fontsBuild;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

/*
ЧАСТИ GULP СЦЕНАРИЯ
SCSS МИКСИН ДЛЯ ПОДКЛЮЧЕНИЯ ШРИФТОВ
@mixin font($font_name, $file_name, $weight, $style) {
  @font-face {
    font-family: $font_name;
    font-display: swap;
    src: url("../fonts/#{$file_name}.woff") format("woff"), url("../fonts/#{$file_name}.woff2") format("woff2");
    font-weight: #{$weight};
    font-style: #{$style};
  }
}


JS-ФУНКЦИЯ ОПРЕДЕЛЕНИЯ ПОДДЕРЖКИ WEBP
function testWebP(callback) {

var webP = new Image();
webP.onload = webP.onerror = function () {
callback(webP.height == 2);
};
webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

if (support == true) {
document.querySelector('body').classList.add('webp');
}else{
document.querySelector('body').classList.add('no-webp');
}
});
*/
