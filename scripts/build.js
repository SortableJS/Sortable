import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import banner from './banner.js';
import typescript from 'rollup-plugin-typescript2';


export default {
	output: {
		banner,
		name: 'Sortable'
	},
	plugins: [
		json(),
		typescript(),
		resolve()
    ]
};
