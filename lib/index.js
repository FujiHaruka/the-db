/**
 * DB for the-framework
 * @module the-db
 */
'use strict'

const TheDb = require('./TheDb')
const create = require('./create')

const lib = create.bind(this)

Object.assign(lib, {
  TheDb,
  create
})

module.exports = lib
