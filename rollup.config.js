import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    name: 'fxToolTip', 
  	file: 'dist/fxToolTip.js',
    strict: true,
    format: 'iife',
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({'babelHelpers': 'bundled'})
    ]
};