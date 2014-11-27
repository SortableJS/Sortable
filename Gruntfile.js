module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		version: {
			src: ['<%= pkg.exportName %>.js', '*.json']
		},

		jshint: {
			all: ['*.js', '!*.min.js'],

			options: {
				strict: true,
				newcap: false,	// "Tolerate uncapitalized constructors"
				node: true,
				expr: true, // - true && call() "Expected an assignment or function call and instead saw an expression."
				supernew: true, // - "Missing '()' invoking a constructor."
				laxbreak: true,
				white: true,
				globals: {
					define: true,
					test: true,
					expect: true,
					module: true,
					asyncTest: true,
					start: true,
					ok: true,
					equal: true,
					notEqual: true,
					deepEqual: true,
					window: true,
					document: true,
					performance: true
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.exportName %> <%= pkg.version %> - <%= pkg.license %> | <%= pkg.repository.url %> */\n'
			},
			dist: {
				files: {
					'<%= pkg.exportName %>.min.js': ['<%= pkg.exportName %>.js']
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	grunt.registerTask('tests', ['jshint']);
	grunt.registerTask('default', ['tests', 'version', 'uglify']);
};
