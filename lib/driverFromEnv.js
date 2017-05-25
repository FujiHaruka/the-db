/**
 * Create driver from env
 * @function driverFromEnv
 */
'use strict'

const { toLowerKeys } = require('./helpers')

/** @lends driverFromEnv */
function driverFromEnv (env) {
  let {
    dialect = 'memory',
    storage,
    database,
    username,
    password,
    host,
    port,
    pool = true
  } = toLowerKeys(env)
  switch (String(dialect).toLowerCase().trim()) {
    case 'memory':
      return require('clay-driver-memory')()
    case 'mysql':
      return require('clay-driver-mysql')(database, username, password, {
        host, port, pool
      })
    case 'json':
      return require('clay-driver-json')(storage)
    case 'sqlite':
      return require('clay-driver-sqlite')(storage)
    case 'localstorage':
      return require('clay-driver-localstorage')
    default:
      throw new Error(`Unknown dialect: "${dialect}`)
  }
}

module.exports = driverFromEnv
