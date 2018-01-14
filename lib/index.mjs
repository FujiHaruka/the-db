/**
 * DB for the-framework
 * @module the-db
 */
'use strict'

import TheDB from './TheDB'
import create from './create'
import driverFromEnv from './driverFromEnv'
import execForEnv from './execForEnv'
import helpers from './helpers'
import mixins from './mixins'
import resources from './resources'
import setupForEnv from './setupForEnv'

export {
  TheDB,
  create,
  driverFromEnv,
  execForEnv,
  helpers,
  mixins,
  resources,
  setupForEnv,
}

export default create