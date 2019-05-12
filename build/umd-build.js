import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import fs from 'fs';

let pluginConfigs = [];

fs.readdirSync('plugins').forEach(file => {
	if (!file.match(/\.js$/i)) return;
	let name = file.replace(/\.js$/i, '');
	pluginConfigs.push({
		input: `plugins/${ name }.js`,
		output: {
			file: `dist/plugins/${ name }.js`,
			format: 'umd',
			name
		},
		plugins: [
			babel()
		]
	});
});

export default [
	{
		input: 'entry/entry-complete.js',
		output: {
			file: 'dist/sortable-complete.umd.js',
			format: 'umd',
			name: 'Sortable'
		},
		plugins: [
			json(),
			babel()
		]
	},
	{
		input: 'src/Sortable.js',
		output: {
			file: 'dist/sortable.umd.js',
			format: 'umd',
			name: 'Sortable'
		},
		plugins: [
			json(),
			babel()
		]
	},
	...pluginConfigs
];
