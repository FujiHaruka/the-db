/**
 * @function setupMysql
 */

'use strict'

const execcli = require('execcli')
const co = require('co')
const colorprint = require('colorprint')

/** @lends setupMysql */
function setupMysql (env, options = {}) {
  const {
    rootUsername = process.env.ROOT_USERNAME || 'root',
    rootPassword = process.env.ROOT_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
    host = 'localhost',
    database,
    username,
    password,
    port
  } = env

  let sql = _sql(database, username, password)

  let cmdBin = 'mysql'
  let cmdArgs = _args(rootUsername, host, rootPassword, sql)

  return co(function * () {
    colorprint.debug(`  Executing SQL...`)
    colorprint.trace(sql.split(/;\s?/g).join('\n'))
    yield execcli(cmdBin, cmdArgs, {})
    colorprint.debug('  ...SQL done!')
  })
}

function _sql (database, username, password) {
  return `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8; GRANT ALL ON \`${database}\`.* TO \`${username}\` IDENTIFIED BY "${password}"`
}

function _args (username, host, password, sql) {
  let args = [
    '-u', username
  ]
  if (host) {
    args = args.concat('-h', host)
  }
  if (password) {
    process.env.MYSQL_PWD = password
  }
  args = args.concat({ 'e': sql })
  return args
}

module.exports = setupMysql
