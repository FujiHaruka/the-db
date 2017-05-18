/**
 * @class TheDB
 * @param {Object} config
 * @param {string} [config.name=uuid.v4()] Name of clay-lump
 * @param {string} [config.dialect='memory'] - Database dialect. "mysql", "json", "memory", "localstorage", or "sqlite"
 * @param {string} [config.storage] - Storage file name for "sqlite" or "json" dialect
 * @param {string} [config.database] - Name of database schema
 * @param {string} [config.username] - Database username
 * @param {string} [config.password] - Database password
 * @param {string} [config.host] - Database password
 * @param {string} [config.port] - Database password
 */
'use strict'

const { ClayLump } = require('clay-lump')
const uuid = require('uuid')
const { clone } = require('asobj')
const driverFromEnv = require('./driverFromEnv')

const asBound = (bound) => (resource, attributesArray, actionContext) =>
  attributesArray.map((attributes) => bound(attributes))

/** @lends TheDB */
class TheDB extends ClayLump {
  constructor (config = {}) {
    const {
      name = uuid.v4()
    } = config
    let env = config.env || clone(config, { without: 'name' })
    let driver = driverFromEnv(env)
    super(name, { driver })
    const s = this
    s._env = env
  }

  get env () {
    const s = this
    return s._env
  }

  get resources () {
    const s = this
    return s._resources
  }

  /**
   * Register resource form Resource Class
   * @param {function} ResourceClass - Resource class to register
   * @param {string} resourceName - Name of resource
   */
  load (ResourceClass, resourceName) {
    const s = this
    let { driver } = s
    let {
      inbound,
      outbound,
      policy,
      entityClass,
      collectionClass
    } = ResourceClass
    let duplicate = s.hasResource(resourceName)
    if (duplicate) {
      throw new Error(`Resource with name "${resourceName}" is already registered!`)
    }
    let resource = ResourceClass.fromDriver(driver, resourceName, {
      annotates: true
    })
    if (policy) {
      resource.policy(policy)
    }
    if (inbound) {
      resource.addInbound('the:inbound', asBound(inbound))
    }
    if (outbound) {
      resource.addOutbound('the:outbound', asBound(outbound))
    }
    if (entityClass) {
      resource.enhanceResourceEntity(entityClass)
    }
    if (collectionClass) {
      resource.enhanceResourceCollection(collectionClass)
    }
    s.setResource(resourceName, resource)
  }

  /**
   * Get a resource with name
   * @param {string} resourceName - Name of the resource
   * @returns {?ClayResource}
   */
  getResource (resourceName) {
    let found = super.getResource(resourceName)
    if (!found) {
      console.warn(`[TheDB] Resource not found with name: ${resourceName}`)
    }
    return found
  }

  /**
   * Check if resource exists
   * @param {string} resourceName
   * @returns {boolean}
   */
  hasResource (resourceName) {
    return Boolean(super.getResource(resourceName))
  }
}

module.exports = TheDB
