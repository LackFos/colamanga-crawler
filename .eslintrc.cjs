module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'google',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'quotes': [2, 'single', {avoidEscape: true}],
    'linebreak-style': 0,
  },
};
