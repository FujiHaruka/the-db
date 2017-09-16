/**
 * Create driver from env
 * @function driverFromEnv
 */
'use strict'

const {toLowerKeys} = require('./helpers')
const {isProduction} = require('the-check')

/** @lends driverFromEnv */
function driverFromEnv (env) {
  const {
    dialect = 'memory',
    storage,
    database,
    username,
    password,
    host,
    port,
    pool_idle: poolIdle = isProduction() ? 10000 : 100,
    pool_min: poolMin = 0,
    pool_max: poolMax = 10
  } = toLowerKeys(env)
  switch (String(dialect).toLowerCase().trim()) {
    case 'memory':
      return require('clay-driver-memory')()
    case 'mysql':
      return require('clay-driver-mysql')(database, username, password, {
        host,
        port,
        pool: {
          min: poolMin,
          max: poolMax,
          idle: poolIdle
        }
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
