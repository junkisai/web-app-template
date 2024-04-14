const baseConf = require('./packages/prettier-config/index.cjs')

/** @type {import('prettier').Config} */
const config = {
  ...baseConf,
}

module.exports = config
