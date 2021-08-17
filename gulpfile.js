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
const imageminWebp = require('imagemin-webp');
const pug = require('gulp-pug');
const formatHtml = require('gulp-format-html');
const browserSync = require('browser-sync').create();

function buildPug() {
	return src('assets/pug/*.pug')
		.pipe(pug({
			pretty: '\t'
		}))
		.pipe(formatHtml())
		.pipe(dest('./'));
}

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
			}),
		]))
		.pipe(dest('assets/img/'));
}

function buildImagesWebp() {
	return src('assets/img/**/*.{png,jpg}')
		.pipe(
			imagemin({
				verbose: true,
				plugins: imageminWebp({ quality: 80 })
			})
		)
		.pipe(rename({extname: '.webp'}))
		.pipe(dest('assets/img/'));
}

function server() {
	browserSync.init({
		server: {
				baseDir: './'
		}
	});
	watch('assets/pug/**/*.pug', buildPug);
	watch('assets/sass/**/*.scss', buildStyles);
	watch('assets/js/libs/**/*.js', buildJsLibs);
	watch('*.html').on('change', browserSync.reload);
	watch('assets/img/**/*').on('all', browserSync.reload);
	watch('assets/js/*.js').on('change', browserSync.reload);
}

exports.styles = buildStyles;
exports.jsLibs = buildJsLibs;
exports.images = buildImages;
exports.imagesWebp = buildImagesWebp;
exports.watch = series(buildPug, buildStyles, buildJsLibs, server);