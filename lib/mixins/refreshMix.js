/**
 * @function refreshMix
 * @param {function} Class
 * @return {function} Mixed Class
 */
'use strict'

const {parse: parseEntityRef} = require('clay-resource-ref')
const {TheRefresher} = require('the-refresher')

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
  }

  return RefreshMixed
}

module.exports = refreshMix
