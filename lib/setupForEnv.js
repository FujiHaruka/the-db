/**
 * Do setup for env
 * @function setupForEnv
 */
'use strict'

const {toLowerKeys} = require('the-db-util')

/** @lends setupForEnv */
async function setupForEnv (env) {
  const {
    database,
    dialect = 'memory',
    host,
    password,
    port,
    root_password: rootPassword,
    root_username: rootUsername,
    storage,
    username,
  } = toLowerKeys(env)

  switch (String(dialect).toLowerCase().trim()) {
    case 'mysql':
      return await require('./helpers/setupMysql')({
        database,
        host,
        password,
        port,
        rootPassword,
        rootUsername,
        username,
      })
    case 'sqlite':
      return await require('./helpers/setupSqlite')({storage})
    default:
      break
  }
}

module.exports = setupForEnv
