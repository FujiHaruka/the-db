/**
 * @function resourceMix
 */
'use strict'

/** @lends resourceMix */
function resourceMix (Class) {
  /** @class ResourceMixed */
  class ResourceMixed extends Class {
    /**
     * Check if resource exists
     * @param {string} resourceName
     * @throws {Error} Resource not found error
     */
    assertResource (resourceName) {
      const has = this.hasResource(resourceName)
      if (!has) {
        throw new Error(`[TheDB] Resource not found: "${resourceName}"`)
      }
    }

    /**
     * Get resource with name
     * @param {string} resourceName
     * @returns {?TheResource}
     */
    getResource (resourceName) {
      const has = this.resources.has(resourceName)
      if (!has) {
        return null
      }
      return this.resources.get(resourceName)
    }

    /**
     * Check if resource exists
     * @param {string} resourceName
     * @returns {boolean}
     */
    hasResource (resourceName) {
      return this.resources.has(resourceName)
    }
  }

  return ResourceMixed
}

module.exports = resourceMix
