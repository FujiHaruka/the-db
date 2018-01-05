/**
 * Buildin resources
 * @module resources
 */
'use strict'

const LogResource = require('./LogResource')
const Resource = require('./Resource')
const SchemaResource = require('./SchemaResource')

module.exports = {
  LogResource,
  Resource,
  SchemaResource
}

exports.LogResource = LogResource
exports.Resource = Resource
exports.SchemaResource = SchemaResource
