/**
 * @function execMysql
 */
'use strict'

const execcli = require('execcli')

async function execMysql (env, sql, options = {}) {
  const {username, host, password, port} = env
  const args = _args(username, host, password, port, sql)
  return execcli('mysql', args, options)
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

module.exports = execMysql