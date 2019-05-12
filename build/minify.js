const UglifyJS = require('uglify-js'),
	fs = require('fs'),
 	package = require('../package.json');

function generateBanner(name) {
	return `/*! ${ name } ${ package.version } - ${ package.license } | ${ package.repository.url } */\n`;
}

// Minify plugins
fs.readdirSync('dist/plugins').filter(file => !file.includes('.min')).forEach(file => {
	let name = file.replace(/\.js/i, '');

	fs.writeFileSync(
		`dist/plugins/${ name }.min.js`,
		generateBanner('SortableJS ' + name.match(/[^\.]*/) + ' Plugin') + UglifyJS.minify(fs.readFileSync(`dist/plugins/${ name }.js`, 'utf8')).code,
		'utf8'
	);
});


// Minify UMD
fs.readdirSync('dist').filter(file => !file.includes('.min') && file.includes('.umd')).forEach(file => {
	let name = file.replace(/\.js/i, '');

	fs.writeFileSync(
		`dist/${ name }.min.js`,
		generateBanner('Sortable') + UglifyJS.minify(fs.readFileSync(`dist/${ name }.js`, 'utf8')).code,
		'utf8'
	);
});
