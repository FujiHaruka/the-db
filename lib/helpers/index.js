/**
 * Helper functions
 * @module helpers
 */
'use strict'

const setupMysql = require('./setupMysql')
const setupPostgres = require('./setupPostgres')
const setupSqlite = require('./setupSqlite')
const toLowerKeys = require('./toLowerKeys')

module.exports = {
  setupMysql,
  setupPostgres,
  setupSqlite,
  toLowerKeys
}
