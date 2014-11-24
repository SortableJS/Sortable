var packageName = 'rubaxa:sortable';

Package.describe({
  name: packageName,
  summary: 'Sortable (official): minimalist reorderable drag-and-drop lists on modern browsers and touch devices',
  version: '0.5.2',
  git: 'https://github.com/RubaXa/Sortable.git'
});

Package.onUse(function (api) {
  api.versionsFrom('0.9.0');
  api.export('Sortable');
  api.addFiles([
    'Sortable.js'
  ], 'client'
  );
});

Package.onTest(function (api) {
  api.use(packageName, 'client');
  api.use('tinytest', 'client');

  api.addFiles('meteor/test.js', 'client');
});
