const astroPlugin = require('prettier-plugin-astro')
const baseConf = require('../../packages/prettier-config/index.cjs')

/** @type {import('prettier').Config} */
const config = {
  ...baseConf,
  plugins: [...baseConf.plugins, astroPlugin],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}

module.exports = config
