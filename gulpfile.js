const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

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

function buildJsLibs() {
	return src(['assets/js/libs/jquery.js', 'assets/js/libs/*.js'], {allowEmpty: true})
		.pipe(concat('libs.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(dest('assets/js/'))
		.pipe(browserSync.stream());
};

function buildImages() {
	return src('assets/img/**/*.{png,jpg,svg}')
		.pipe(imagemin([
			imagemin.mozjpeg({quality: 80, progressive: true}),
			imagemin.optipng({optimizationLevel: 2}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		]))
		.pipe(dest('assets/img/'));
}

function server() {
	browserSync.init({
		server: {
				baseDir: './'
		}
	});
	watch('assets/sass/**/*.scss', buildStyles);
	watch('assets/js/libs/**/*.js', buildJsLibs);
	watch('*.html').on('change', browserSync.reload);
	watch('assets/img/**/*').on('all', browserSync.reload);
	watch('assets/js/*.js').on('change', browserSync.reload);
}

exports.scss = buildStyles;
exports.jsLibs = buildJsLibs;
exports.images = buildImages;
exports.watch = series(buildStyles, buildJsLibs, server);