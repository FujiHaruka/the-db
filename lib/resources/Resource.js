/**
 * Resource for the DB
 * @class Resource
 */
'use strict'

const {ClayResource} = require('clay-resource')
const debug = require('debug')('the:db:resource')

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
    s.closed = true
    s.removeAllListeners()
  }
}

function RefreshMix (ResourceClass) {
  return class RefreshMixed extends ResourceClass {
    constructor (...args) {
      super(...args)
      const s = this
      s._idsToRefresh = {}
      s._refreshTimer = -1
    }

    startRefreshLoop (handler, options = {}) {
      const s = this
      const {interval = 300} = options
      debug('start refresh loop', {interval})
      if (s._refreshTimer !== -1) {
        throw new Error(`Refresh loop already started`)
      }

      async function tick () {
        if (s.closed) {
          return
        }
        const ids = Object.keys(s._idsToRefresh)
        for (const id of ids) {
          debug('refresh', id)
          const entity = await s.one(id)
          if (entity) {
            await handler(entity)
          } else {
            debug('entity not found for refresh', id)
          }
          delete s._idsToRefresh[id]
        }
        setTimeout(tick, interval).unref()
      }

      return tick()
    }

    stopRefreshLoop () {
      const s = this
      debug('stop refresh loop')
      clearTimeout(s._refreshTimer)
      s._refreshTimer = -1
    }

    requestToRefresh (id) {
      const s = this
      id = String(id.id || id)
      s._idsToRefresh[id] = true
    }

    close (...args) {
      const s = this
      super.close(...args)
      clearTimeout(s._refreshTimer)
      s._refreshTimer = -1
    }

  }
}

module.exports = [
  RefreshMix
].reduce((Clazz, mixin) => mixin(Clazz), Resource)