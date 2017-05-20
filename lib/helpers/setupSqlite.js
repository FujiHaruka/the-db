/**
 * @function setupSqlite
 */

'use strict'

const mkdirp = require('mkdirp')
const co = require('co')
const path = require('path')
const { ok } = require('assert')

/** @lends setupSqlite */
function setupSqlite (env, options = {}) {
  let { storage } = env
  ok(storage, 'env.STORAGE is required for sqlite.')
  return co(function * () {
    yield new Promise((resolve, reject) =>
      mkdirp(path.dirname(storage), (err) => err ? reject(err) : resolve())
    )
  })
}

module.exports = setupSqlite
