const fs = require('fs')
const common = JSON.parse(fs.readFileSync('.eslintrc.json'))

module.exports = {
  ...common,
  parserOptions: {
    sourceType: 'module',
    tsconfigRootDir: '.',
    project: ['./tsconfig.json'],
  },
  extends: [
    ...common.extends,
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    ...common.rules,
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          arguments: false,
        },
      },
    ],
  },
}

