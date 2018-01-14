/**
 * Mixins for listen
 * @function listenMix
 */
'use strict'

const {
  ResourceEvents: {
    ENTITY_CREATE,
    ENTITY_CREATE_BULK,
    ENTITY_UPDATE,
    ENTITY_UPDATE_BULK,
    ENTITY_DESTROY,
    ENTITY_DESTROY_BULK,
    ENTITY_DROP
  }
} = require('clay-resource')

/** @lends listenMix */
function listenMix (Class) {
  /** @lends ListenMixed */
  return class ListenMixed extends Class {

    /**
     * Listen to create
     * @param {function} onCreate
     * @returns {function} close function
     */
    listenToCreate (onCreate) {
      return this.listenEvents({
        [ENTITY_CREATE]: ({created}) => onCreate(created),
        [ENTITY_CREATE_BULK]: ({created}) => created.map((created) => onCreate(created)),
      })
    }

    /**
     * Listen to update
     * @param {function} onUpdate
     * @returns {function} close function
     */
    listenToUpdate (onUpdate) {
      return this.listenEvents({
        [ENTITY_UPDATE]: ({id, updated}) => onUpdate(id, updated),
        [ENTITY_UPDATE_BULK]: ({ids, updated}) => ids.map((id, i) => onUpdate(id, updated[i])),
      })
    }

    /**
     * Listen to destroy
     * @param {function} onDestroy
     * @returns {function} close function
     */
    listenToDestroy (onDestroy) {
      return this.listenEvents({
        [ENTITY_DESTROY]: ({id, destroyed}) => onDestroy(id, destroyed),
        [ENTITY_DESTROY_BULK]: ({ids, destroyed}) => ids.map((id, i) => onDestroy(id, destroyed[i])),
      })
    }

    /**
     * Listen to drop
     * @param {function} onDrop
     * @returns {function} close function
     */
    listenToDrop (onDrop) {
      return this.listenEvents({
        [ENTITY_DROP]: ({dropped}) => onDrop(dropped)
      })
    }

    listenEvents (handlers) {
      const closeFuncs = []
      for (const [event, handler] of Object.entries(handlers)) {
        this.addListener(event, handler)
        closeFuncs.push(
          () => this.removeListener(event, handler)
        )
      }
      return () => closeFuncs.map((close) => close())
    }

  }

}

module.exports = listenMix


