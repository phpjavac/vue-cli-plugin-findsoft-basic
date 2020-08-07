module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  ignorePatterns: [
    'types',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'max-classes-per-file': ['error', 3],
    'linebreak-style': [0, 'error', 'windows'], // 允许windows开发环境
    'no-param-reassign': ['error', { props: false }],
    'max-len': ['error', { code: 185 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
