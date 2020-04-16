const { series, parallel, watch, src, dest } = require('gulp')
const del = require('del')
const pug = require('gulp-pug')
const gulpif = require('gulp-if')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const browsersync = require('browser-sync').create()
const changed = require('gulp-changed')

const _src = 'src/'
const _dest = 'dist'

const config = {
	port: 4300,
	src: _src,
	dest: _dest,
	pug: {
		src: [_src + 'html/**/*.pug', '!' + _src + 'html/_templates/**/*', '!' + _src + 'html/_includes/**/*'],
		options: { pretty: true }
	},
	sass: {
		src: _src + 'assets/sass/**/*.sass',
		dest: _dest + '/assets/css'
	},
	js: {
		src: [ _src + 'assets/js/pages/**/*.js' ],
		dest: _dest + 'assets/js'
	},
	images: {
		src: _src + 'assets/img/**/*',
		dest: _dest + '/assets/img'
	}
}

const ENV_DEV = 'development'
const ENV_PROD = 'production'

function isProductionEnv () {
	return getNodeEnv() === ENV_PROD
}

function getNodeEnv () {
	return process.env.NODE_ENV || ENV_DEV
}

function clean (cb) {
	return del(config.dest, cb)
}

function html () {
	const pugOptions = config.pug.options
	return src(config.pug.src)
		.pipe(pug(pugOptions))
		.pipe(dest(config.dest))
		.pipe(browsersync.stream())
}

function css () {
	return src(config.sass.src)
		.pipe(sass({ indentedSyntax: true }))
		.pipe(autoprefixer())
		.pipe(gulpif(isProductionEnv, cleanCSS({ compatibility: 'ie8' })))
		.pipe(dest(config.sass.dest))
		.pipe(browsersync.stream())
}

function images () {
	return src(config.images.src)
		.pipe(changed(config.images.dest))
		.pipe(gulpif(isProductionEnv, imagemin()))
		.pipe(dest(config.images.dest))
		.pipe(browsersync.stream())
}

function serve (cb) {
	browsersync.init({
		server: { baseDir: './' + config.dest },
		port: config.port,
		notify: false,
		open: true
	})
	cb()
}

function watchAll () {
	watch(config.pug.src, html)
	watch(config.sass.src, css)
	watch(config.images.src, images)
}

exports.build = series(
	clean,
	parallel(html, css, images)
)

exports.dev = series(
	exports.build,
	series(serve, watchAll)
)

exports.html = html
exports.css = css
