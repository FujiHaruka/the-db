/**
 * Buildin resources
 * @module resources
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

module.exports = {
  get TheLogResource () { return _d(require('./TheLogResource')) },
  get TheSchemaResource () { return _d(require('./TheSchemaResource')) },
}
