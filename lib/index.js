/**
 * DB for the-framework
 * @module the-db
 */
'use strict'

const TheDB = require('./TheDB')
const create = require('./create')
const DataTypes = require('./DataTypes')
const Resource = require('./Resource')
const Refresher = require('./Refresher')

const lib = create.bind(this)

Object.assign(lib, {
  TheDB,
  create,
  DataTypes,
  Resource,
  Refresher
})

module.exports = lib
