import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    rules: {
      // prettier rules
      'prettier/prettier': 'off',

      // typescript-eslint rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      "@typescript-eslint/no-unused-vars": "off",

      // react rules
      "react/no-unescaped-entities": "off",
      "react/no-children-prop": "off",
    }
  }
]

export default eslintConfig
