/**
 * Buildin resources
 * @module resources
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

const LogResource = _d(require('./LogResource'))
const Resource = _d(require('./Resource'))
const SchemaResource = _d(require('./SchemaResource'))

module.exports = {
  LogResource,
  Resource,
  SchemaResource,
}
