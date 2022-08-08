import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel' // 导入babel
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import path from 'path'
import dts from 'rollup-plugin-dts'

const isPro = process.env.NODE_ENV === 'production'
const plugins = [
  nodeResolve({
    browser: true
  }),
  commonjs(),
  typescript({
    exclude: 'node_modules/**',
    typescript: require('typescript')
  }), //配置ts
  babel({
    exclude: 'node_modules/**', // 防止打包node_modules下的文件
    extensions: ['.js', '.ts'],
    babelHelpers: 'runtime'
  }),
  isPro && terser() // 压缩代码
]
export default [
  {
    //入口文件
    input: './src/core/index.ts',
    output: [
      //打包 esModule
      {
        file: path.resolve(__dirname, './dist/index.esm.js'),
        format: 'es'
      },
      //打包 commonjs
      {
        file: path.resolve(__dirname, './dist/index.cjs.js'),
        format: 'cjs'
      }
    ],
    plugins
  },
  {
    //入口文件
    input: './src/core/report.ts',
    output: [
      //打包 AMD CMD UMD
      {
        file: path.resolve(__dirname, './dist/index.js'),
        format: 'umd',
        name: 'Monitor'
      }
    ],
    plugins
  },
  {
    //打包声明文件
    input: './src/core/index.ts',
    output: {
      input: './src/core/index.ts',
      file: path.resolve(__dirname, './dist/index.d.ts'),
      format: 'es'
    },
    plugins: [dts()]
  }
]
