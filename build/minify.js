const UglifyJS = require('uglify-js'),
	fs = require('fs'),
 	package = require('../package.json');

const banner = `/*! Sortable ${ package.version } - ${ package.license } | ${ package.repository.url } */\n`;

fs.writeFileSync(
	`./Sortable.min.js`,
	banner + UglifyJS.minify(fs.readFileSync(`./Sortable.js`, 'utf8')).code,
	'utf8'
);
