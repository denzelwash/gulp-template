const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss')
const browserSync = require('browser-sync').create();

	// pug = require('gulp-pug'),
	// prefixer = require('gulp-autoprefixer'),
	// uglify = require('gulp-uglify'),
	// concat = require('gulp-concat'),
	// cssnano = require('gulp-cssnano'),
	// sass = require('gulp-sass'),
	// del = require('del'),
	// imagemin = require('gulp-imagemin'),
	// plumber = require('gulp-plumber'),
	// rename = require('gulp-rename'),
	// sourcemaps = require('gulp-sourcemaps'),
	// browserSync = require('browser-sync').create();

//////////////////////////////////////////////

function buildStyles() {
  return src('assets/sass/*.scss')
		.pipe(sourcemaps.init())
    .pipe(sass()
		.on('error', sass.logError))
		.pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('/'))
    .pipe(dest('assets/css'))
		.pipe(browserSync.stream());
};

function jsLibs() {
	return src(['assets/js/libs/jquery.js', 'assets/js/libs/*.js'], {allowEmpty: true})
		.pipe(concat('libs.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(dest('assets/js/'))
		.pipe(browserSync.stream());
};

function server() {
	browserSync.init({
		server: {
				baseDir: './'
		}
	});
	watch('assets/sass/**/*.scss', buildStyles);
	watch('assets/js/libs/**/*.js', jsLibs);
	watch('*.html').on('change', browserSync.reload);
	watch('assets/js/*.js').on('change', browserSync.reload);
}

exports.scss = buildStyles;
exports.watch = series(buildStyles, jsLibs, server);