/**
 * Resource for the DB
 * @class Resource
 */
'use strict'

const {ClayResource} = require('clay-resource')

class Resource extends ClayResource {
  constructor (...args) {
    super(...args)
    this.db = null
    this.closed = false
  }

  close () {
    this.db = null
    this.removeAllListeners()
    this.closed = true
  }
}

module.exports = [].reduce((Clazz, mixin) => mixin(Clazz), Resource)