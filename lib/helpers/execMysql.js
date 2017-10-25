/**
 * @function execMysql
 */
'use strict'

const execcli = require('execcli')

async function execMysql (env, sql, options = {}) {
  const {username, host, password, port, database} = env
  const args = _args({username, host, password, port, database}, sql)
  return execcli('mysql', args, options)
}

function _args ({username, host, password, port, database}, sql) {
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
  if (database) {
    args = args.concat('-D', database)
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