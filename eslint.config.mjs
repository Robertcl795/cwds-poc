// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config({
  ignores: ['**/dist/**', '**/coverage/**', '**/storybook-static/**', '**/node_modules/**']
}, eslint.configs.recommended, ...tseslint.configs.recommended, {
  files: ['**/*.ts'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  }
}, prettierConfig, storybook.configs["flat/recommended"]);
