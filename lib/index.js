/**
 * DB for the-framework
 * @module the-db
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

const DataTypes = _d(require('./DataTypes'))
const Refresher = _d(require('./Refresher'))
const Resource = _d(require('./Resource'))
const TheDB = _d(require('./TheDB'))
const create = _d(require('./create'))
const driverFromEnv = _d(require('./driverFromEnv'))
const execForEnv = _d(require('./execForEnv'))
const helpers = _d(require('./helpers'))
const mixins = _d(require('./mixins'))
const resources = _d(require('./resources'))
const setupForEnv = _d(require('./setupForEnv'))

module.exports = {
  DataTypes,
  Refresher,
  Resource,
  TheDB,
  create,
  driverFromEnv,
  execForEnv,
  helpers,
  mixins,
  resources,
  setupForEnv,
  default: create,
}
