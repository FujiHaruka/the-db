/**
 * Do exec for env
 * @function execForEnv
 */
'use strict'

const {toLowerKeys} = require('the-db-util')

/** @lends execForEnv */
async function execForEnv (env, sql) {
  const {
    database,
    dialect = 'memory',
    host,
    password,
    port,
    storage,
    username,
  } = toLowerKeys(env)

  switch (String(dialect).toLowerCase().trim()) {
    case 'mysql':
      return require('./helpers/execMysql')({
        database,
        host,
        password,
        port,
        username,
      }, sql)
    case 'sqlite':
      return require('./helpers/execSqlite')({
        database,
        storage,
      }, sql)
    default:
      throw new Error(`Exec not implemented for dialect: ${dialect}`)
  }
}

module.exports = execForEnv
