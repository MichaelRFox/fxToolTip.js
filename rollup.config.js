import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  format: 'iife',
  moduleName: 'fxToolTip',
  dest: 'dist/iife/fxToolTip.js',
  //acorn: {allowReserved: true},
  plugins: [
  	resolve(),
  	babel()
  ],
  useStrict: true
};