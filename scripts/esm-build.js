import build from './build.js';
import { terser } from 'rollup-plugin-terser'

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
	let buildCopy = { ...build, plugins: [...build.plugins, terser()] };
	return Object.assign(buildCopy, config);
});
