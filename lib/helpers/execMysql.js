/**
 * @function execMysql
 */
'use strict'

const mysql = require('mysql2')

async function execMysql (env, sqls, options = {}) {
  const {database, host, password, port, username} = env
  const connection = mysql.createConnection({
    host,
    user: username,
    password,
    port,
    database,
    protocol: 'TCP'
  })
  for (const sql of [].concat(sqls)) {
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, (err, result) => err ? reject(err) : resolve(result))
    })
  }
  await connection.close()
}

module.exports = execMysql
