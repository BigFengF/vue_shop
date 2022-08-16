module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "indent": 0,
    'no-unused-vars': 'off',
    'space-before-function-paren': 0,
    "quotes": [1, "single"],
    "semi": 0,
    "singleQuote": 0,
    'space-before-blocks': 0,
    'no-trailing-spaces': 2

  }
}
