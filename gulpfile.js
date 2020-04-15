const { series, parallel, watch, src, dest } = require('gulp')
const del = require('del')
const pug = require('gulp-pug')

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
	autoprefixer: {
		options: { browsers: ["last 3 version"] }
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
}


exports.build = series(
	clean,
	parallel(html)
)

exports.html = html
