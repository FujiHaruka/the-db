/**
 * Buildin resources
 * @module resources
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

const TheLogResource = _d(require('./TheLogResource'))
const TheSchemaResource = _d(require('./TheSchemaResource'))

module.exports = {
  TheLogResource,
  TheSchemaResource,
}
