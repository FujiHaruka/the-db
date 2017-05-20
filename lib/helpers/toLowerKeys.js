/**
 * @function toLowerKeys
 */
'use strict'

/** @lends toLowerKeys */
function toLowerKeys (obj = {}) {
  return Object.keys(obj).reduce((result, name) => Object.assign(result, {
    [String(name).toLowerCase()]: obj[ name ]
  }), {})
}

module.exports = toLowerKeys
