/**
 * @function execMysql
 */
'use strict'

const execcli = require('execcli')

async function execMysql (env, sql, options = {}) {
  const {storage} = env
  console.log(sql)
  return execcli('sqlite3', [storage, sql], options)
}

module.exports = execMysql