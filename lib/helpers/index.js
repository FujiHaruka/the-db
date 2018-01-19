/**
 * Helper functions
 * @module helpers
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

const binder = _d(require('./binder'))
const createTerminal = _d(require('./createTerminal'))
const execMysql = _d(require('./execMysql'))
const execSqlite = _d(require('./execSqlite'))
const setupMysql = _d(require('./setupMysql'))
const setupPostgres = _d(require('./setupPostgres'))
const setupSqlite = _d(require('./setupSqlite'))

module.exports = {
  binder,
  createTerminal,
  execMysql,
  execSqlite,
  setupMysql,
  setupPostgres,
  setupSqlite,
}
