var gulp = require('gulp'),
	pug = require('gulp-pug'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	cssnano = require('gulp-cssnano'),
	sass = require('gulp-sass'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	plumber = require('gulp-plumber'),
	rename = require("gulp-rename"),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create();

//////////////////////////////////////////////

function html() {
	return gulp.src('src/pug/*.pug')
		.pipe(pug({
			pretty: '  '
		}))
		.pipe(gulp.dest('src/'))
}

function style() {
	return gulp.src('src/sass/*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', sass.logError)
		.pipe(prefixer(['last 15 versions']))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest('src/css/'))
		.pipe(browserSync.stream());
}

function script() {
	return gulp.src(['src/js/libs/jquery.js', 'src/js/libs/*.js'])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest('src/js/'))
		.pipe(browserSync.stream());
};

function imagesBuild() {
	gulp.src('src/img/**/*.{png,jpg,gif,svg}')
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('build/img/'));
}

function fontsBuild() {
	gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('build/fonts'));
}

function server() {
	browserSync.init({
		server: {
			baseDir: 'src'
		}
	});
	gulp.watch('./src/sass/**/*.scss', style);
	gulp.watch('./src/js/script.js', script);
	gulp.watch('./src/pug/*.pug', html);
	gulp.watch("./src/*.html").on('change', browserSync.reload);
	gulp.watch('./src/img/**/*.{png,jpg,gif,svg}', browserSync.reload);
	gulp.watch('./src/fonts/*', browserSync.reload);
}

function clean() {
	return del(['build'])
}

function build(done) {
	gulp.src('src/css/*.css')
		.pipe(gulp.dest('build/css/'))
		.pipe(cssnano())
		.pipe(rename(function (path) {
			path.basename += '.min'
		}))
		.pipe(gulp.dest('build/css/'));
	gulp.src('src/js/*.js')
		.pipe(gulp.dest('build/js/'))
		.pipe(uglify())
		.pipe(rename(function (path) {
			path.basename += '.min'
		}))
		.pipe(gulp.dest('build/js/'));
	gulp.src('src/*.html')
		.pipe(gulp.dest('build'));
	gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts/'));
	gulp.src('src/img/**/*.{png,jpg,gif,svg}')
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('build/img/'));
	done();
}

gulp.task('pug', html);
gulp.task('sass', style);
gulp.task('js', script);
gulp.task('fonts', fontsBuild);
gulp.task('imagesBuild', imagesBuild);
gulp.task('watch', gulp.series(html, style, script, server));
// gulp.task('build', gulp.series(clean, html, style, script, build));