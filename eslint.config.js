import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwind from 'eslint-plugin-tailwindcss';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import prettierOptions from './.prettierrc.json' with { type: 'json' };

export default defineConfig([
  // 1. Global Ignores (Kept your 'dist' ignore)
  globalIgnores(['dist', 'node_modules', '.vite']),

  // 2. Base TypeScript, React, and Quality Rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      tailwindcss: tailwind,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    settings: {
      react: { version: 'detect' },
      tailwindcss: {
        callees: ['cn', 'cva'],
        config: false, // Tailwind v4 uses CSS-based configuration
      },
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
      ],
      // React Hooks safety
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Tailwind class hygiene
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/no-custom-classname': 'off',
    },
  },

  // 3. Prettier Integration (Must be LAST to turn off conflicting rules)
  prettierConfig, // Turns off all ESLint formatting rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { prettier },
    rules: {
      'prettier/prettier': ['error', prettierOptions], // Report Prettier violations as ESLint errors
    },
  },
]);
