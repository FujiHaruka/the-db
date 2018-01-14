/**
 * Resource for the DB
 * @class Resource
 * @extends ClayResource
 * @extends ListenMixed
 */
'use strict'

const listenMix = require('./mixins/listenMix')
const {ClayResource} = require('clay-resource')

const ResourceBase = listenMix(ClayResource)

/** @lends Resource */
class Resource extends ResourceBase {
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