import vue from 'rollup-plugin-vue'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const external = ['vue', 'quasar', '@lambdatt-qui/toolcase']

export default [
  // ESM build
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/qui-iam.esm.js',
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
      file: 'dist/qui-iam.cjs.js',
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