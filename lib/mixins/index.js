/**
 * Mixins
 * @module mixins
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

const cliMix = _d(require('./cliMix'))
const exportImportMix = _d(require('./exportImportMix'))
const migrateMix = _d(require('./migrateMix'))

module.exports = {
  cliMix,
  exportImportMix,
  migrateMix,
}
