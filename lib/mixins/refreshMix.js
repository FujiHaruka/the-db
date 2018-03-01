/**
 * @function refreshMix
 * @param {function} Class
 * @return {function} Mixed Class
 */
'use strict'

const asleep = require('asleep')
const {parse: parseEntityRef} = require('clay-resource-ref')
const {TheRefresher} = require('the-refresher')
const {unlessProduction} = require('the-check')

const assertIsRef = (ref) => {
  const type = typeof ref
  if (type !== 'string') {
    throw new Error(`[TheDB] Ref must be string, bud passed ${type}`)
  }
}

/** @lends refreshMix */
function refreshMix (Class) {
  /** @lends RefreshMixed */
  class RefreshMixed extends Class {
    constructor () {
      super(...arguments)
      this._refresher = null
    }

    /**
     * Request to refresh entity
     * @param {string} entityRef
     */
    requestToRefresh (entityRef) {
      unlessProduction(() => assertIsRef(entityRef))
      this._refresher.request(entityRef)
    }

    /**
     * Start refreshing loop
     * @param {number} interval
     */
    startRefreshLoop ({interval = 300} = {}) {
      if (this._refresher) {
        throw new Error(`refreshLoop already started`)
      }
      this._refresher = new TheRefresher(
        async (entityRef) => await this.doRefresh(entityRef),
        {
          interval,
        }
      )
      this._refresher.start()
    }

    /**
     * Stop refreshing loop
     */
    stopRefreshLoop () {
      if (!this._refresher) {
        return
      }
      this._refresher.stop()
      this._refresher = null
    }

    async doRefresh (entityRef) {
      unlessProduction(() => assertIsRef(entityRef))
      const {resource: resourceName} = parseEntityRef(entityRef)
      const resource = this.getResource(resourceName)
      if (!resource) {
        return
      }
      if (!resource.refresh) {
        return
      }
      const entity = await this.resolveEntityRef(entityRef)
      await resource.refresh(entity)
    }

    /**
     * Wait until refresh
     * @param {string} entityRef
     * @param {Object} [options={}] - Optional settings
     * @returns {Promise<Boolean>} - Full filled
     */
    async waitToRefresh (entityRef, options = {}) {
      unlessProduction(() => assertIsRef(entityRef))
      const {timeout = 60 * 1000} = options
      const startedAt = new Date()
      while (this._refresher.has(entityRef)) {
        await asleep(10)
        const passed = new Date() - startedAt
        if (timeout < passed) {
          return false
        }
      }
      return true
    }
  }

  return RefreshMixed
}

module.exports = refreshMix
