const { strictEslint } = require('@umijs/fabric');

strictEslint.rules = {
  ...strictEslint.rules,
  'no-underscore-dangle': [0],
  'no-shadow': [0],
  'import/no-unresolved': [0],
  '@typescript-eslint/no-empty-interface': [0],
  'react/no-danger': [0],
  'react/no-array-index-key': [0],
  'no-plusplus': [0],
  'no-return-assign': [0],
  'no-unused-expressions': [0],
  'consistent-return': [0],
  '@typescript-eslint/no-explicit-any': [0],
  'eslint-comments/no-unlimited-disable': [0],
};

module.exports = {
  ...strictEslint,
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
};