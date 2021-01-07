module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 0,
    'no-undef': 0,
    camelcase: 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 0,
  },
};
