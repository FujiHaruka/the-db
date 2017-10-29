/**
 * Resource for the DB
 * @class Resource
 */
'use strict'

const {ClayResource} = require('clay-resource')

class Resource extends ClayResource {
  constructor (...args) {
    super(...args)
    const s = this
    s.db = null
    s.closed = false
  }

  close () {
    const s = this
    s.db = null
    s.removeAllListeners()
    s.closed = true
  }
}

module.exports = [].reduce((Clazz, mixin) => mixin(Clazz), Resource)