/** @type {import('eslint/lib/shared/types').ConfigData} */
const config = {
  extends: ['@packages/eslint-config', 'plugin:astro/recommended'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  ],
}

module.exports = config
