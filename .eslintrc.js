/** @format */
module.exports = {
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['dist', 'node_modules', '*.d.ts'],
  rules: {
    semi: ['warn', 'never'],
    // 要求使用 === 和 !==
    eqeqeq: 'warn',
    // 强制使用骆驼拼写法命名约定
    camelcase: 'off',
    // 禁止 if 语句中 return 语句之后有 else 块
    'no-else-return': 'warn',
  },
}
