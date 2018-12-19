/* jshint ignore:start */
const gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	each = require('gulp-each'),
	path = require('path'),
	pump = require('pump')
;

const package = require('./package.json'),
	  name = package.exportName,
	  versionExp = /(?<=\"version\":\s{0,}\")(.{0,})(?=\")/i;

gulp.task('version', function() {
	let version = package.version;
	return pump([
		gulp.src('./*.json'),
		each(function(content, file, callback){
			let prevVersion = content.match(versionExp);
			prevVersion && (prevVersion = prevVersion[0]);
			content = content.replace(versionExp, version);
			prevVersion && prevVersion !== version && console.info(`Updated version in ${ path.basename(file.history[0]) }:\t${ prevVersion } -> ${ version }`);
			callback(null, content);
		}),
		gulp.dest('./')
	]);
});

gulp.task('minify', function() {
	return pump([
		gulp.src(`./${ name }.js`),
		uglify({
			output: {
				preamble: `/*! ${ name } ${ package.version } - ${ package.license } | ${ package.repository.url } */\n`
			}
		}),
		rename({
			suffix: '.min'
		}),
		gulp.dest(`./`)
	]);
});

gulp.task('build', gulp.series('version', 'minify'));
/* jshint ignore:end */
