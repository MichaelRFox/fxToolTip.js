import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    name: 'fxToolTip', 
  	file: 'dist/fxToolTip.js',
    strict: true,
    format: 'iife',
  },
  plugins: [resolve()]
};