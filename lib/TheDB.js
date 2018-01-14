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

const {ClayLump} = require('clay-lump')
const uuid = require('uuid')
const asleep = require('asleep')
const {clone} = require('asobj')
const driverFromEnv = require('./driverFromEnv')
const setupForEnv = require('./setupForEnv')
const {unlinkAsync} = require('asfs')
const {toLowerKeys} = require('the-db-util')
const execForEnv = require('./execForEnv')
const {TheResource} = require('the-resource-base')
const {unlessProduction} = require('the-check')

const m = require('./mixins')

const {TheSchemaResource, TheLogResource} = require('./resources')

const asBound = (bound) => (resource, attributesArray, actionContext) =>
  attributesArray.map((attributes) => bound.call(resource, attributes))

const TheDBBase = [
  m.cliMix,
  m.exportImportMix,
  m.migrateMix
].reduce((Class, mix) => mix(Class), ClayLump)

/** @lends TheDB */
class TheDB extends TheDBBase {
  constructor (config = {}) {
    const {
      name = uuid.v4(),
      resources = {},
      hooks = {}
    } = config
    const env = toLowerKeys(config.env || clone(config, {without: ['name', 'resources']}))
    const driver = driverFromEnv(env)
    super(name, {driver})

    this._unref = false
    this._env = env
    this.setup = () => setupForEnv(this.env)
    this.exec = (sql) => execForEnv(this.env, sql)
    this.closed = false
    this.loadFromMapping({
      TheDBSchema: TheSchemaResource,
      TheDBLog: TheLogResource,
      ...resources
    })
    this.hookFromMapping({
      ...hooks
    })
  }

  get env () {
    return this._env
  }

  get resources () {
    return this._resources
  }

  /**
   * Register resource form Resource Class
   * @param {function} ResourceClass - Resource class to register
   * @param {string} resourceName - Name of resource
   * @returns {ClayResource} Loaded resource class
   */
  load (ResourceClass, resourceName) {
    unlessProduction(({ok}) => {
      ok(!!ResourceClass, 'ResourceClass is required')
      const isResource = (ResourceClass.prototype instanceof TheResource) ||
        (ResourceClass === TheResource) ||
        (ResourceClass.name === 'TheResource')
      ok(isResource, 'ResourceClass should inherit TheResource')
    })

    const {driver} = this
    const {
      inbound,
      outbound,
      policy,
      entityClass,
      collectionClass,
      onCreate,
      onUpdate,
      onDestroy,
      onDrop,
      skipResolvingRefFor
    } = ResourceClass
    const duplicate = this.hasResource(resourceName)

    const wrapActionContext = (actionContext) => Object.assign(actionContext, {
      skipResolvingRefFor: [].concat(actionContext.skipResolvingRefFor, skipResolvingRefFor).filter(Boolean)
    })

    if (duplicate) {
      throw new Error(`Resource with name "${resourceName}" is already registered!`)
    }
    const resource = ResourceClass.fromDriver(driver, resourceName, {
      annotates: true
    })
    if (policy) {
      resource.policy(policy)
    }
    if (inbound) {
      const {applyInbound} = resource
      const handler = asBound(inbound)
      resource.applyInbound = async function applyInboundWrap (attributesArray, actionContext = {}) {
        actionContext = wrapActionContext(actionContext)
        attributesArray = await handler(resource, attributesArray, actionContext)
        attributesArray = await applyInbound.call(resource, attributesArray, actionContext)
        return attributesArray
      }
    }
    if (outbound) {
      const {applyOutbound} = resource
      const handler = asBound(outbound)
      resource.applyOutbound = async function applyOutboundWrap (entities, actionContext = {}) {
        actionContext = wrapActionContext(actionContext)
        entities = await applyOutbound.call(resource, entities, actionContext)
        return await handler(resource, entities, actionContext)
      }
    }
    if (entityClass) {
      resource.enhanceResourceEntity(entityClass)
    }
    if (collectionClass) {
      resource.enhanceResourceCollection(collectionClass)
    }
    resource.listenTo({onCreate, onUpdate, onDestroy, onDrop})

    this.setResource(resourceName, resource)
    this.theDBLogEnabled = true

    resource.db = this

    return resource
  }

  /**
   * Load resources from mapping object
   * @param {Object.<string, function>} ResourceMapping - Resource name and class
   */
  loadFromMapping (ResourceMapping) {
    for (const [as, Resource] of Object.entries(ResourceMapping)) {
      this.load(Resource, as)
    }
  }

  /**
   * Hook from mapping
   * @param HookMapping
   * @param {Object.<string, function>} HookMapping - Resource name and hook creators
   */
  hookFromMapping (HookMapping) {
    for (const [resourceName, creator] of Object.entries(HookMapping)) {
      this.assertResource(resourceName)
      const resource = this.getResource(resourceName)
      const {onCreate, onUpdate, onDestroy, onDrop} = creator(this, {resourceName})
      resource.listenTo({onCreate, onUpdate, onDestroy, onDrop})
    }
  }

  /**
   * Check if resource exists
   * @param {string} resourceName
   * @returns {boolean}
   */
  hasResource (resourceName) {
    return Boolean(super.getResource(resourceName))
  }

  assertResource (resourceName) {
    const has = this.hasResource(resourceName)
    if (!has) {
      throw new Error(`Resource not found: "${resourceName}"`)
    }
  }

  async drop () {
    const {driver, resources} = this
    const {dialect, database, storage} = this.env
    switch (String(dialect).trim()) {
      case 'mysql': {
        await this.close().catch((e) => null)
        await this.exec(`drop database if exists ${database};`)
        return
      }
      case 'sqlite': {
        await unlinkAsync(storage).catch((e) => null)
        return
      }
      default :
        break
    }
    if (!driver.drop) {
      throw new Error(`Not implemented!`)
    }
    for (const resourceName of Object.keys(resources)) {
      await driver.drop(resourceName)
    }
    await asleep(10)
  }

  /**
   * Update database migration version
   * @param {string} version - Version string
   * @returns {Promise.boolean} Success or not
   */
  async updateVersion (version) {
    return this.updateMigrationVersion(version)
  }

  async close (...args) {
    await asleep(10)
    if (this.closed) {
      return
    }
    this.emit('beforeClose')
    const {resources} = this
    for (const name of Object.keys(resources)) {
      const resource = resources[name]
      try {
        await resource.close()
      } catch (e) {
        // Do nothing
      }
    }
    await asleep(10)
    super.close(...args)
    this.emit('close')
    await asleep(10)
    this.closed = true
  }

  /**
   * Aut close before exit
   * @returns {TheDB} this
   */
  unref () {
    const close = this.close.bind(close)
    if (this._unref) {
      throw new Error(`Already unref`)
    }
    process.setMaxListeners(process.getMaxListeners() + 1)
    process.on('beforeExit', close)
    this._unref = true
    return this
  }
}

module.exports = TheDB
