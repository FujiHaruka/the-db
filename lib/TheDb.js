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
      env = {},
      resources = {}
    } = config
    let driver = driverFromEnv(env)
    super(name, { driver })
    const s = this
    for (let key of Object.keys(resources)) {
      let ResourceClass = resources[ key ]
      let resourceName = String(
        clayResourceName(key || ResourceClass.nameString || ResourceClass.name)
      )
      s.registerResourceFromClass(resourceName, ResourceClass)
    }
  }

  get resources () {
    return this._resources
  }

  /**
   * Register resource form Resource Class
   * @param {strong} resourceName - Resource name to register with
   * @param {function} ResourceClass - Resource class to register
   */
  registerResourceFromClass (resourceName, ResourceClass) {
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
    let resource = ResourceClass.fromDriver(driver, resourceName, { annotates: true })
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
