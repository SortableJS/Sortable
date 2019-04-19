import json from 'rollup-plugin-json';

export default [
  {
    input: 'index-iife.js',
    output: {
      file: 'dist/sortable.js',
      format: 'iife',
      name: 'Sortable'
    },
    plugins: [json()]
  }
];
