/**
 * Mixins
 * @module mixins
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

module.exports = {
  get cliMix () { return _d(require('./cliMix')) },
  get exportImportMix () { return _d(require('./exportImportMix')) },
  get migrateMix () { return _d(require('./migrateMix')) },
}
