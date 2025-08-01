import vue from 'rollup-plugin-vue'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const external = ['vue', 'quasar']

export default [
  // ESM build
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/qui-toolcase.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      vue(),
      terser()
    ]
  },
  // CommonJS build
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/qui-toolcase.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'default'
    },
    plugins: [
      resolve(),
      commonjs(),
      vue(),
      terser()
    ]
  }
]