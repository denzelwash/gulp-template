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
const svgSprite = require('gulp-svg-sprite');
const purgecss = require('gulp-purgecss');
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
		.pipe(purgecss({
			content: ['*.html'],
			safelist: {
				greedy: [/modal-open$/, /modal-backdrop$/, /show$/, /hide$/, /desktop$/, /mobile$/, /active$/, /open$/, /fade$/, /path$/, /svg$/]
			}
		}))
		.pipe(postcss([autoprefixer()]))
		.pipe(cleanCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('/'))
		.pipe(dest('assets/css'))
		.pipe(browserSync.stream());
};

function buildJsLibs() {
	return src([
		'./node_modules/bootstrap/dist/js/bootstrap.bundle.js',
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(dest('assets/js/'))
		.pipe(browserSync.stream());
};

function buildImages() {
	return src('assets/img/**/*.{png,jpg}')
		.pipe(imagemin([
			imagemin.mozjpeg({quality: 80, progressive: true}),
			imagemin.optipng({optimizationLevel: 2}),
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

function buildSvgSprite() {
	return src(['assets/img/svg/**/*.svg', '!assets/img/svg/sprite.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
						sprite: '../sprite.svg'
				}
			},
		}))
		.pipe(dest('assets/img/svg/'));
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
	watch(['assets/img/svg/**/*.svg', '!assets/img/svg/sprite.svg']).on('all', buildSvgSprite);
	watch('assets/img/**/*').on('all', browserSync.reload);
	watch('assets/js/*.js').on('change', browserSync.reload);
}

exports.pug = buildPug;
exports.styles = buildStyles;
exports.jsLibs = buildJsLibs;
exports.images = buildImages;
exports.imagesWebp = buildImagesWebp;
exports.sprite = buildSvgSprite;

exports.watch = series(buildPug, buildStyles, buildJsLibs, buildSvgSprite, server);