import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
	input: 'entry/entry-modular.js',
	output: {
		file: 'dist/sortable.esm.js',
		format: 'esm',
		name: 'Sortable'
	},
	plugins: [
		json(),
		babel()
    ]
};
