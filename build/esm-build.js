import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import build from './build.js';

export default ([
	{
		input: 'entry/entry-core.js',
		output: Object.assign({}, build.output, {
			file: 'modular/sortable.core.esm.js',
			format: 'esm'
		})
	},
	{
		input: 'entry/entry-defaults.js',
		output: Object.assign({}, build.output, {
			file: 'modular/sortable.esm.js',
			format: 'esm'
		})
	},
	{
		input: 'entry/entry-complete.js',
		output: Object.assign({}, build.output, {
			file: 'modular/sortable.complete.esm.js',
			format: 'esm'
		})
	}
]).map(config => {
	let buildCopy = { ...build };
	return Object.assign(buildCopy, config);
});
