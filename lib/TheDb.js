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
      let { inbound, outbound, policy, nameString = ResourceClass.name } = ResourceClass
      let resourceName = String(clayResourceName(key || nameString))
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
      s.setResource(resourceName, resource)
    }
  }

  get resources () {
    return this._resources
  }
}

module.exports = TheDb
