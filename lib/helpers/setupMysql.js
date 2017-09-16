/**
 * @function setupMysql
 */

'use strict'

const execcli = require('execcli')

const asleep = require('asleep')
const colorprint = require('colorprint')

/** @lends setupMysql */
async function setupMysql (env, options = {}) {
  const {
    retryMax = 3,
    retryInterval = 3000
  } = options
  const {
    rootUsername = process.env.ROOT_USERNAME || 'root',
    rootPassword = process.env.ROOT_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
    host = 'localhost',
    database,
    username,
    password,
    port
  } = env

  const setupSQL = _setupSQL(database, username, password)

  const execute = (sql, options = {}) => execcli('mysql', _args(rootUsername, host, rootPassword, port, sql), options)

  const _waitToSetup = async () => {
    for (let i = 0; i < retryMax; i++) {
      try {
        await execute('SHOW DATABASES', {suppressOut: true})
      } catch (e) {
        await asleep(retryInterval)
        continue
      }
      break
    }
  }

  colorprint.debug(`  Executing SQL...`)
  await _waitToSetup()
  colorprint.trace(setupSQL.split(/;\s?/g).join('\n'))
  await execute(setupSQL)
  colorprint.debug('  ...SQL done!')
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
  args = args.concat({'e': sql})
  return args
}

module.exports = setupMysql
