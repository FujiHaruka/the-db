/**
 * Mixins
 * @module mixins
 */
'use strict'

const cliMix = require('./cliMix')
const exportImportMix = require('./exportImportMix')
const migrateMix = require('./migrateMix')

module.exports = {
  cliMix,
  exportImportMix,
  migrateMix
}

exports.cliMix = cliMix
exports.exportImportMix = exportImportMix
exports.migrateMix = migrateMix
