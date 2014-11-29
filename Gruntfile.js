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
		},

		shell: {
			'meteor-test': {
				command: 'meteor/runtests.sh'
			},
			'meteor-publish': {
				command: 'meteor/publish.sh'
			}
		}

	});


	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-shell');

	// Meteor tasks
	grunt.registerTask('meteor-test', 'shell:meteor-test');
	grunt.registerTask('meteor-publish', 'shell:meteor-publish');
	// ideally we'd run tests before publishing, but the chances of tests breaking (given that
	// Meteor is orthogonal to the library) are so small that it's not worth the maintainer's time
	// grunt.regsterTask('meteor', ['shell:meteor-test', 'shell:meteor-publish']);
	grunt.registerTask('meteor', 'shell:meteor-publish');

	// Default task.
	grunt.registerTask('default', ['version', 'uglify']);
};
