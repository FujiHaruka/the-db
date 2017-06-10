/**
 * @function setupMysql
 */

'use strict'

const execcli = require('execcli')
const co = require('co')
const asleep = require('asleep')
const colorprint = require('colorprint')

/** @lends setupMysql */
function setupMysql (env, options = {}) {
  let {
    retryMax = 3,
    retryInterval = 3000
  } = options
  let {
    rootUsername = process.env.ROOT_USERNAME || 'root',
    rootPassword = process.env.ROOT_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
    host = 'localhost',
    database,
    username,
    password,
    port
  } = env

  let setupSQL = _setupSQL(database, username, password)

  let execute = (sql, options = {}) => execcli('mysql', _args(rootUsername, host, rootPassword, port, sql), options)

  let _waitToSetup = () => co(function * () {
    for (let i = 0; i < retryMax; i++) {
      try {
        yield execute('SHOW DATABASES', { suppressOut: true })
      } catch (e) {
        yield asleep(retryInterval)
        continue
      }
      break
    }
  })

  return co(function * () {
    colorprint.debug(`  Executing SQL...`)
    yield _waitToSetup()
    colorprint.trace(setupSQL.split(/;\s?/g).join('\n'))
    yield execute(setupSQL)
    colorprint.debug('  ...SQL done!')
  })
}

function _setupSQL (database, username, password) {
  return `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8; GRANT ALL ON \`${database}\`.* TO \`${username}\` IDENTIFIED BY "${password}"`
}

function _args (username, host, password, port, sql) {
  let args = [
    '-u', username,
    '--protocol', 'TCP'
  ]
  if (host) {
    args = args.concat('-h', host)
  }
  if (port) {
    args = args.concat('-P', port)
  }
  if (password) {
    process.env.MYSQL_PWD = password
    if (process.env.CI) {
      args = args.concat('-p' + password)
    }
  }
  args = args.concat({ 'e': sql })
  return args
}

module.exports = setupMysql
