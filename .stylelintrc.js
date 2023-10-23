module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-standard-vue/scss', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  rules: {
    'no-descending-specificity': null,
    // 'no-empty-source': null,
    // 'selector-class-pattern': null,
  },
};
