/**
 * @class TheDb
 * @param {Object} config
 * @param {Object} config.env - Env variables. Upper case keys will be converted lower key. `{DIALECT: 'mysql'}` -> `{dialect: 'mysql'}`
 * @param {string} [config.env.dialect='memory'] - Database dialect. "mysql", "json", "memory", "localstorage", or "sqlite"
 * @param {string} [config.env.storage] - Storage file name for "sqlite" or "json" dialect
 * @param {string} [config.env.database] - Name of database schema
 * @param {string} [config.env.username] - Database username
 * @param {string} [config.env.password] - Database password
 * @param {string} [config.env.host] - Database password
 * @param {string} [config.env.port] - Database password
 * @param {Object} config.resources - Resource classes
 */
'use strict'

const { ClayLump } = require('clay-lump')
const uuid = require('uuid')
const driverFromEnv = require('./driverFromEnv')

const clayResourceName = require('clay-resource-name')

const asBound = (bound) => (resource, attributesArray, actionContext) =>
  attributesArray.map((attributes) => bound(attributes))

/** @lends TheDb */
class TheDb extends ClayLump {
  constructor (config) {
    const {
      name = uuid.v4(),
      env = {}
    } = config
    let driver = driverFromEnv(env)
    super(name, { driver })
  }

  get resources () {
    const s = this
    return s._resources
  }

  /**
   * Load resource classes
   * @param resourceClasses
   * @returns {TheDb}
   */
  load (resourceClasses) {
    const s = this
    for (let ResourceClass of resourceClasses) {
      let resourceName = String(
        clayResourceName(ResourceClass.nameString || ResourceClass.name)
      )
      s.loadResourceFromClass(resourceName, ResourceClass)
    }
    return s
  }

  /**
   * Register resource form Resource Class
   * @param {string} resourceName - Name of resource
   * @param {function} ResourceClass - Resource class to register
   */
  loadResourceFromClass (resourceName, ResourceClass) {
    const s = this
    let { driver } = s
    let {
      inbound,
      outbound,
      policy,
      entityClass,
      collectionClass
    } = ResourceClass
    let duplicate = !!s.getResource(resourceName)
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
}

module.exports = TheDb
