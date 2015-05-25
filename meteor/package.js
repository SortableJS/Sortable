// package metadata file for Meteor.js
'use strict';

var packageName = 'rubaxa:sortable';  // http://atmospherejs.com/rubaxa/sortable

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
	name: packageName,
	summary: 'Sortable: reactive minimalist reorderable drag-and-drop lists on modern browsers and touch devices',
	version: packageJson.version,
	git: 'https://github.com/RubaXa/Sortable.git',
	documentation: 'meteor/README.md'
});

Package.onUse(function (api) {
	api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);
	api.use('templating', 'client');
	api.use('dburles:mongo-collection-instances@0.3.3');  // to watch collections getting created
	api.export('Sortable');  // exported on the server too, as a global to hold the array of sortable collections (for security)
	api.addFiles([
		'Sortable.js',
		'meteor/template.html',  // the HTML comes first, so reactivize.js can refer to the template in it
		'meteor/reactivize.js'
	], 'client');
	api.addFiles('meteor/methods-client.js', 'client');
	api.addFiles('meteor/methods-server.js', 'server');
});

Package.onTest(function (api) {
	api.use(packageName, 'client');
	api.use('tinytest', 'client');

	api.addFiles('meteor/test.js', 'client');
});
