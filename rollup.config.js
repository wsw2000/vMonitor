
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel' // 导入babel
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import path from 'path'
import dts from 'rollup-plugin-dts'
export default [
  {
    //入口文件
    input: './src/core/index.ts',
    output: [
      //打包esModule
      {
        file: path.resolve(__dirname, './dist/index.esm.js'),
        format: 'es'
      },
      //打包common js
      {
        file: path.resolve(__dirname, './dist/index.cjs.js'),
        format: 'cjs'
      },
      //打包 AMD CMD UMD
      {
        input: './src/core/index.ts',
        file: path.resolve(__dirname, './dist/index.js'),
        format: 'umd',
        name: 'Monitor'
      }
    ],
    //配置ts
    plugins: [
      nodeResolve({
        browser: true
      }),
      babel({
        exclude: 'node_modules/**', // 防止打包node_modules下的文件
        runtimeHelpers: true       // 使plugin-transform-runtime生效
      }),
      // 压缩代码
      terser(),
      typescript({
        exclude: "node_modules/**",
        typescript: require("typescript")
      }),
      commonjs()
    ]
  },
  {
    //打包声明文件
    input: './src/core/index.ts',
    output: {
      file: path.resolve(__dirname, './dist/index.d.ts'),
      format: 'es'
    },
    plugins: [dts()]
  }
]
