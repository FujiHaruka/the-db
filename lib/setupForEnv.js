/**
 * Do setup for env
 * @function setupForEnv
 */
'use strict'

const {toLowerKeys} = require('./helpers')

/** @lends setupForEnv */
function setupForEnv (env) {
  const {
    dialect = 'memory',
    storage,
    database,
    username,
    password,
    host,
    port,
    root_username: rootUsername,
    root_password: rootPassword
  } = toLowerKeys(env)

  switch (String(dialect).toLowerCase().trim()) {
    case 'mysql':
      return require('./helpers/setupMysql')({
        rootUsername,
        rootPassword,
        username,
        password,
        host,
        database,
        port
      })
    case 'sqlite':
      return require('./helpers/setupSqlite')({storage})
    default:
      break
  }
}

module.exports = setupForEnv
