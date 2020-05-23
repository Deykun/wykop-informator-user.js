module.exports = {
  'env': {
    'browser': true,
    'jest': true,
    'es6': true,
    'node': true,
  },
  'extends': 'eslint:recommended',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 11
  },
  'rules': {
    'indent': [
      'error',
      2,
      {'SwitchCase': 1}
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  },
}
