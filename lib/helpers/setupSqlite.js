/**
 * @function setupSqlite
 */

'use strict'

const mkdirp = require('mkdirp')

const path = require('path')
const {ok} = require('assert')

/** @lends setupSqlite */
async function setupSqlite (env, options = {}) {
  const {storage} = env
  ok(storage, 'env.STORAGE is required for sqlite.')
  await new Promise((resolve, reject) =>
    mkdirp(path.dirname(storage), (err) => err ? reject(err) : resolve())
  )
}

module.exports = setupSqlite
