/**
 * @function cascadeMix
 * @param {function} Class
 * @return {function} Mixed Class
 */
'use strict'

const debug = require('debug')('the:db:cascade')

/** @lends cascadeMix */
function cascadeMix (Class) {
  class CascadeMixed extends Class {
    constructor () {
      super(...arguments)
      this._cascadeListeners = []
    }

    startCascadeLink () {
      for (const [_, follower] of Object.entries(this.resources)) {
        const {cascaded = {}} = follower.constructor
        for (const [followeeName, creator] of Object.entries(cascaded)) {
          const followee = this.getResource(followeeName)
          this._cascadeListeners.push(
            followee.listenToDestroy(
              async ({gone}) => {
                const condition = await creator(gone)
                if (!condition) {
                  debug('Nothing to cascade', followeeName)
                  return
                }
                const entities = await follower.all(condition)
                const destroyingIds = entities.map(({id}) => id && String(id)).filter(Boolean)
                debug('Cascade', gone.toRef(), follower.resourceName, destroyingIds)
                await follower.destroyBulk(destroyingIds)
              }
            )
          )
        }
      }
    }

    stopCascadeLink () {
      for (const close of this._cascadeListeners) {
        close()
      }
      this._cascadeListeners = []
    }
  }

  return CascadeMixed
}

module.exports = cascadeMix
