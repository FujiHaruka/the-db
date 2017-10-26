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
const aslogger = require('aslogger')
const {clone} = require('asobj')
const {inspect} = require('util')
const driverFromEnv = require('./driverFromEnv')
const setupForEnv = require('./setupForEnv')
const {unlinkAsync} = require('asfs')
const {toLowerKeys} = require('./helpers')
const execForEnv = require('./execForEnv')
const {ResourceEvents} = require('clay-resource')
const createTerminal = require('./helpers/createTerminal')
const {
  ENTITY_CREATE,
  ENTITY_CREATE_BULK,
  ENTITY_UPDATE,
  ENTITY_UPDATE_BULK,
  ENTITY_DESTROY,
  ENTITY_DESTROY_BULK,
  ENTITY_DROP
} = ResourceEvents

const {SchemaResource} = require('./resources')

const asBound = (bound) => (resource, attributesArray, actionContext) =>
  attributesArray.map((attributes) => bound(attributes))

/** @lends TheDB */
class TheDB extends ClayLump {
  constructor (config = {}) {
    const {
      name = uuid.v4()
    } = config
    const env = toLowerKeys(config.env || clone(config, {without: /^name$/}))
    const driver = driverFromEnv(env)
    super(name, {driver})

    const s = this
    s._env = env
    s.setup = () => setupForEnv(s.env)
    s.exec = (sql) => execForEnv(s.env, sql)

    s.load(SchemaResource, 'TheDBSchema')
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
   * @returns {ClayResource} Loaded resource class
   */
  load (ResourceClass, resourceName) {
    const s = this
    const {driver} = s
    const {
      inbound,
      outbound,
      policy,
      entityClass,
      collectionClass,
      onCreate,
      onUpdate,
      onDestroy,
      onDrop
    } = ResourceClass
    const duplicate = s.hasResource(resourceName)
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

    if (onCreate) {
      resource.addListener(ENTITY_CREATE, ({created}) => onCreate(created, ENTITY_CREATE))
      resource.addListener(ENTITY_CREATE_BULK, ({created}) => created.map((created) => onCreate(created, ENTITY_CREATE_BULK)))
    }
    if (onUpdate) {
      resource.addListener(ENTITY_UPDATE, ({id, updated}) => onUpdate(id, updated, ENTITY_UPDATE))
      resource.addListener(ENTITY_UPDATE_BULK, ({ids, updated}) => ids.map((id, i) => onUpdate(id, updated[i], ENTITY_UPDATE_BULK)))
    }
    if (onDestroy) {
      resource.addListener(ENTITY_DESTROY, ({id, destroyed}) => onDestroy(id, destroyed, ENTITY_DESTROY))
      resource.addListener(ENTITY_DESTROY_BULK, ({ids, destroyed}) => ids.map((id, i) => onDestroy(id, destroyed[i], ENTITY_DESTROY_BULK)))
    }
    if (onDrop) {
      resource.addListener(ENTITY_DROP, ({dropped}) => onDrop(dropped))
    }

    s.setResource(resourceName, resource)

    return resource
  }

  /**
   * Check if resource exists
   * @param {string} resourceName
   * @returns {boolean}
   */
  hasResource (resourceName) {
    return Boolean(super.getResource(resourceName))
  }

  async drop () {
    const s = this
    const {driver, resources} = s
    const {dialect, database, storage} = s.env
    switch (String(dialect).trim()) {
      case 'mysql': {
        await s.exec(`drop database if exists ${database};`)
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
  }

  /**
   * Run database migration
   * @param {Object.<string, function>} handlers - Migration handler for each versions
   * @returns {Promise.<?Object>} Migration result
   */
  async migrate (handlers = {}) {
    const s = this
    const {TheDBSchema} = s.resources

    const schema = await TheDBSchema.current()

    if (schema.migratedAt) {
      return null
    }

    const {version} = schema
    const handler = handlers[version]
    if (!handler) {
      return null
    }
    await handler(s, {schema})

    const {version: newVersion} = await TheDBSchema.current()
    if (newVersion === version) {
      throw new Error(
        '[TheDB migration schema seems invalid. You should call `db.updateVersion(version)` after migration handling'
      )
    }

    await schema.update({migratedAt: new Date()})
    return {from: version, to: newVersion}
  }

  async updateVersion (version) {
    const s = this
    const {TheDBSchema} = s.resources
    const schema = await TheDBSchema.current()
    if (schema.version === version) {
      return false
    }
    await TheDBSchema.create({version})
    return true
  }

  async cli () {
    const s = this
    const {resources, env} = s
    const resourceNames = Object.keys(resources)
    const declare = resourceNames.map((name) => `const ${name} = db.resources.${name}`).join(';')
    const logger = aslogger({})
    const info = clone(env, {without: ['password', 'rootPassword']})
    logger.point('Welcome to the-db prompt!')
    logger.trace(`DB Env:`, inspect(info))
    logger.trace(`DB Resources:`, inspect(resourceNames))
    logger.info('')
    return createTerminal((line) => {
      //TODO Support multi-line script
      //TODO Support varialbe declration
      try {
        const script = `${declare}; return (${line})`
        return (new Function('global', 'db', 'resources', script))({}, s, resources)
      } catch (e) {
        return inspect(e)
      }
    }, {prompt: 'the-db> '})
  }

  async close (...args) {
    super.close(...args)
    const s = this
    s.emit('close')
    const {resources} = s
    for (const name of Object.keys(resources)) {
      const resource = resources[name]
      resource.removeAllListeners()
    }
  }
}

module.exports = TheDB
