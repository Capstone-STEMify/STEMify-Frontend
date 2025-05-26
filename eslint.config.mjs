import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': ts
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/consistent-type-imports': 'warn'
      // thêm các rule khác nếu muốn
    }
  },
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      a11y,
      import: importPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'a11y/alt-text': 'warn'
    }
  },
  {
    rules: {
      'import/order': ['warn', { 'newlines-between': 'always' }]
    }
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    ignores: ['node_modules', 'dist', '.next'],
    rules: {}
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    extends: ['eslint-config-prettier']
  }
];
