// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores([
  "dist",
  "storybook-static",
  "playwright-report",
  "test-results",
  ".storybook",
  "src/stories",
  "tests",
  "playwright.config.ts",
]), {
  files: ['**/*.{ts,tsx,js,jsx}'],
  ignores: ['scripts/**'],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    reactHooks.configs['recommended-latest'],
    reactRefresh.configs.vite,
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      ecmaVersion: 'latest',
      ecmaFeatures: { jsx: true },
      sourceType: 'module',
    },
  },
  rules: {
    'no-unused-vars': 'off',
    'no-empty': 'off',
    'react-refresh/only-export-components': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
  },
}, {
  files: ['scripts/**/*.js'],
  extends: [js.configs.recommended],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.node,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  rules: {
    'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
  },
}, ...storybook.configs["flat/recommended"]])
