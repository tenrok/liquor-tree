const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  root: true,
  env: {
    node: true,
    'jest/globals': true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module'
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['jest', 'prettier'],
  rules: {
    'no-console': isProduction ? 'warn' : 'off',
    'no-debugger': isProduction ? 'warn' : 'off',
    'vue/html-indent': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/multi-word-component-names': 'warn'
  }
};
