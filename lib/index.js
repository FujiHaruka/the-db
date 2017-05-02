/**
 * DB for the-framework
 * @module the-db
 */
'use strict'

const TheDb = require('./TheDb')
const create = require('./create')
const { DataTypes } = require('clay-constants')
const { ClayResource } = require('clay-resource')

const lib = create.bind(this)

Object.assign(lib, {
  TheDb,
  create,
  DataTypes,
  ClayResource,
  Resource: ClayResource
})

module.exports = lib
