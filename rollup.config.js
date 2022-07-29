import ts from 'rollup-plugin-typescript2'
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
    plugins: [ts()]
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
