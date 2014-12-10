// package metadata file for Meteor.js
'use strict';

var packageName = 'rubaxa:sortable';  // http://atmospherejs.com/sortable/sortable
var where = 'client';  // where to install: 'client', 'server', or ['client', 'server']

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
  name: packageName,
  summary: 'Sortable (official): minimalist reorderable drag-and-drop lists on modern browsers and touch devices',
  version: packageJson.version,
  git: 'https://github.com/RubaXa/Sortable.git'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@0.9.0');
  api.export('Sortable');
  api.addFiles([
    'Sortable.js'
  ], where
  );
});

Package.onTest(function (api) {
  api.use(packageName, where);
  api.use('tinytest', where);

  api.addFiles('meteor/test.js', where);
});
