/** @format */
module.exports = {
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['dist', 'node_modules', '*.d.ts'],
  rules: {
    semi: ['warn', 'never'],
    eqeqeq: 'warn',
    'no-else-return': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'comma-dangle': [2, 'never'],
    'prettier/prettier': 'off',
    'prefer-rest-params': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
}
