/**
 * @function execMysql
 */
'use strict'

const mysql = require('mysql2')
const {cleanup} = require('asobj')

async function execMysql (env, sqls, options = {}) {
  const {database, host, password, port, username} = env
  const connection = mysql.createConnection(cleanup({
    database,
    host,
    password,
    port,
    protocol: 'TCP',
    user: username,
  }, {}))
  for (const sql of [].concat(sqls)) {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, (err, result) => err ? reject(err) : resolve(result))
    })
  }
  await connection.close()
}

module.exports = execMysql
