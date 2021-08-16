const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')

	// pug = require('gulp-pug'),
	// prefixer = require('gulp-autoprefixer'),
	// uglify = require('gulp-uglify'),
	// concat = require('gulp-concat'),
	// cssnano = require('gulp-cssnano'),
	// sass = require('gulp-sass'),
	// del = require('del'),
	// imagemin = require('gulp-imagemin'),
	// plumber = require('gulp-plumber'),
	// rename = require("gulp-rename"),
	// sourcemaps = require('gulp-sourcemaps'),
	// browserSync = require('browser-sync').create();

//////////////////////////////////////////////

function buildStyles() {
  return src('./assets/sass/*.scss')
		.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('/'))
    .pipe(dest('./assets/css'));
};

exports.scss = buildStyles;