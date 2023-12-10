/** @type {import('eslint/lib/shared/types').ConfigData} */
const config = {
  extends: ['@packages/eslint-config'],
  settings: {
    next: {
      root: 'apps/',
    },
  },
}

module.exports = config
