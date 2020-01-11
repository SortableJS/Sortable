const path = require('path')

const UglifyJS = require('uglify-js'),
	fs = require('fs'),
 	package = require('../package.json');

const banner = `/*! Sortable ${ package.version } - ${ package.license } | ${ package.repository.url } */\n`;
const p = path.resolve(__dirname, '../Sortable.js')

fs.writeFileSync(
	`./Sortable.min.js`,
	banner + UglifyJS.minify(fs.readFileSync(p,'utf8')).code,
	'utf8'
);
