/**
 * DB for the-framework
 * @module the-db
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

module.exports = {
  get TheDB () { return _d(require('./TheDB')) },
  get create () { return _d(require('./create')) },
  get driverFromEnv () { return _d(require('./driverFromEnv')) },
  get execForEnv () { return _d(require('./execForEnv')) },
  get helpers () { return _d(require('./helpers')) },
  get mixins () { return _d(require('./mixins')) },
  get resources () { return _d(require('./resources')) },
  get setupForEnv () { return _d(require('./setupForEnv')) },
  get default () { return _d(require('./create')) },
}
