const { src, dest, series } = require("gulp");
const run = require("gulp-run");
const clean = require("gulp-clean");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const markdown = require("gulp-markdown");

sass.compiler = require("node-sass");

function cleanDist() {
  return src("./dist").pipe(clean());
}

function moveAssets() {
  return src('src/assets/**')
  .pipe(dest('dist/assets'));
}

function compileSass() {
  return src("src/styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("dist"));
}

function cleanCss() {
  return src("dist/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(dest("dist"));
}

function mdToHtml() {
  return src("src/blog/*.md").pipe(markdown()).pipe(dest("dist/blog"));
}

function minifyHtml() {
  return src(["src/*.html", "*.html"])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"));
}

function modifyIndexFile() {
  return run('npm run modify-dist').exec();
}

exports.default = series(
  moveAssets,
  compileSass,
  cleanCss,
  mdToHtml,
  minifyHtml,
  modifyIndexFile
);
