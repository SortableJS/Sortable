'use strict';

module.exports = function (grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		version: {
			src: ['<%= pkg.exportName %>.js', '*.json']
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


	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	// Default task.
	grunt.registerTask('default', ['version', 'uglify']);
};
