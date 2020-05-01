// primary build system tool: gulpjs.com
const { series, parallel, watch, src, dest } = require('gulp')

// basic utilities
const del = require('del')
const gulpif = require('gulp-if')
const changed = require('gulp-changed')

// html templating language https://pugjs.org/
const pug = require('gulp-pug')

// css preprocessor https://sass-lang.com/
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')

// development server utility https://www.browsersync.io/
const browsersync = require('browser-sync').create()

// javascript utilities so we can write ES6+ and transpile it down to
// ES5 for browser support
const rollupEach = require('gulp-rollup-each')
const rollupBuble = require('@rollup/plugin-buble')
const globals = require('rollup-plugin-node-globals')
const builtins = require('rollup-plugin-node-builtins')
const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')

// utilities for minifying and prepping for production
const cleanCSS = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const uglify = require('gulp-uglify')


const ENV_DEV = 'development'
const ENV_PROD = 'production'

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
		dest: _dest + '/assets/js'
	},
	images: {
		src: _src + 'assets/img/**/*',
		dest: _dest + '/assets/img'
	}
}

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

function js () {
    return src(config.js.src)
        .pipe(
            rollupEach(
                {
                    plugins: [
                        rollupBuble({ target: { ie: 11 } }),
                        resolve({
                            jsnext: true,
                            main: true,
                            browser: true
                        }),
                        commonjs(),
                        globals(),
                        builtins()
                    ],
                    isCache: true
                },
                { format: 'iife' }
            )
        )
        .pipe(gulpif(isProductionEnv, uglify()))
        .pipe(dest(config.js.dest))
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
	// this watch is added so that when includes files are changed, 
	// the html is rebuilt. 
	watch(_src + 'html/_includes/**/*', html)
	watch(config.sass.src, css)
	watch(config.images.src, images)
	watch(config.js.src, js)
	// this watch is added so that when the module files change,
	// the javascript is rebuilt
	watch(_src + 'assets/js/modules/**/*', js)
}

/*
these gulp tasks are exported so they can be used by 
our package.json script and node.
*/

// empty the distribution folder and then run the
// primary build tasks in parallel. if the node environment
// is the production environment, these tasks will compress and
// minify files as needed.
exports.build = series(
	clean,
	parallel(html, css, images, js)
)

// the development task run with `npm start` which builds files,
// runs the browsersync server and watches files for changes to
// rebuild them
exports.dev = series(
	exports.build,
	series(serve, watchAll)
)
