/**
 * Helper functions
 * @module helpers
 */
'use strict'

const createTerminal = require('./createTerminal')
const evalScript = require('./evalScript')
const execMysql = require('./execMysql')
const execSqlite = require('./execSqlite')
const setupMysql = require('./setupMysql')
const setupPostgres = require('./setupPostgres')
const setupSqlite = require('./setupSqlite')
const toLowerKeys = require('./toLowerKeys')

module.exports = {
  createTerminal,
  evalScript,
  execMysql,
  execSqlite,
  setupMysql,
  setupPostgres,
  setupSqlite,
  toLowerKeys
}

exports.createTerminal = createTerminal
exports.evalScript = evalScript
exports.execMysql = execMysql
exports.execSqlite = execSqlite
exports.setupMysql = setupMysql
exports.setupPostgres = setupPostgres
exports.setupSqlite = setupSqlite
exports.toLowerKeys = toLowerKeys
