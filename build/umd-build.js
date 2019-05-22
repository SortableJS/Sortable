import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import build from './build.js';


export default ([
	{
		input: 'entry/entry-complete.js',
		output: Object.assign({}, build.output, {
			file: './Sortable.js',
			format: 'umd'
		})
	}
]).map(config => {
	let buildCopy = { ...build };
	return Object.assign(buildCopy, config);
});
