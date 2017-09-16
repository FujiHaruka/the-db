/**
 * DB for the-framework
 * @module the-db
 */
'use strict'

const TheDB = require('./TheDB')
const create = require('./create')
const {DataTypes} = require('clay-constants')
const Resource = require('./Resource')

const lib = create.bind(this)

Object.assign(lib, {
  TheDB,
  create,
  DataTypes,
  Resource
})

module.exports = lib
