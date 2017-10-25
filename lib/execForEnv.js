/**
 * Do exec for env
 * @function execForEnv
 */
'use strict'

const {toLowerKeys} = require('./helpers')

/** @lends execForEnv */
async function execForEnv (env, sql) {
  const {
    dialect = 'memory',
    storage,
    database,
    username,
    password,
    host,
    port
  } = toLowerKeys(env)

  switch (String(dialect).toLowerCase().trim()) {
    case 'mysql':
      return require('./helpers/execMysql')({
        username,
        password,
        host,
        database,
        port
      }, sql)
    default:
      throw new Error(`Not implemented for dialect: ${dialect}`)
  }
}

module.exports = execForEnv
