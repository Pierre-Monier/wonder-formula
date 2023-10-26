/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended-type-checked', 'prettier', 'plugin:prettier/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
      "eqeqeq": "error",
    },
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    root: true,
    "ignorePatterns": ["*.js", "*.cjs"]
  };