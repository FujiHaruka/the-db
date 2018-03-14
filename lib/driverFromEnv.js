/**
 * Create driver from env
 * @function driverFromEnv
 */
'use strict'

const {Op} = require('sequelize')
const {isProduction} = require('the-check')
const {toLowerKeys} = require('the-db-util')

/** @lends driverFromEnv */
function driverFromEnv (env) {
  const {
    database,
    dialect = 'memory',
    host,
    password,
    pool_idle: poolIdle = isProduction() ? 10000 : 1000,
    pool_max: poolMax = 10,
    pool_min: poolMin = 0,
    port,
    storage,
    username,
  } = toLowerKeys(env)
  switch (String(dialect).toLowerCase().trim()) {
    case 'memory':
      return require('clay-driver-memory')()
    case 'mysql':
      return require('clay-driver-mysql')(database, username, password, {
        host,
        operatorsAliases: Op.LegacyAliases,
        pool: {
          idle: poolIdle,
          max: poolMax,
          min: poolMin,
        },
        port, // TODO Remove legacy
      })
    case 'json':
      return require('clay-driver-json')(storage)
    case 'sqlite':
      return require('clay-driver-sqlite')(storage, {
        operatorsAliases: Op.LegacyAliases, // TODO Remove legacy
      })
    case 'localstorage':
      return require('clay-driver-localstorage')
    default:
      throw new Error(`Unknown dialect: "${dialect}`)
  }
}

module.exports = driverFromEnv
