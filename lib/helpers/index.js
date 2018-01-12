/**
 * Helper functions
 * @module helpers
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

const createTerminal = _d(require('./createTerminal'))
const evalScript = _d(require('./evalScript'))
const execMysql = _d(require('./execMysql'))
const execSqlite = _d(require('./execSqlite'))
const setupMysql = _d(require('./setupMysql'))
const setupPostgres = _d(require('./setupPostgres'))
const setupSqlite = _d(require('./setupSqlite'))
const toLowerKeys = _d(require('./toLowerKeys'))

module.exports = {
  createTerminal,
  evalScript,
  execMysql,
  execSqlite,
  setupMysql,
  setupPostgres,
  setupSqlite,
  toLowerKeys,
}
