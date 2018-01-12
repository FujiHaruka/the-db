/**
 * Add cli methods
 * @function cliMix
 */
'use strict'

const aslogger = require('aslogger')
const createTerminal = require('../helpers/createTerminal')
const evalScript = require('../helpers/evalScript')
const {clone} = require('asobj')
const {inspect} = require('util')

/** @lends cliMix */
function cliMix (Class) {
  class CliMixed extends Class {
    async cli () {
      const {resources, env} = this
      const resourceNames = Object.keys(resources)
      const logger = aslogger({})
      const info = clone(env, {without: ['password', 'rootPassword', 'root_password']})
      logger.point('Welcome to the-db prompt!')
      logger.trace(`DB Env:`, inspect(info, {breakLength: Infinity}))
      logger.trace(`DB Resources:`, inspect(resourceNames, {breakLength: Infinity}))
      logger.info('')
      await createTerminal((line) => {
        //TODO Support multi-line script
        try {
          return evalScript(line, {
            prefix: resourceNames.map((name) => `const ${name} = db.resources.${name}`).join(';'),
            variables: {global: {}, db: this, resources}
          })
        } catch (e) {
          delete e.stack
          console.log(inspect(e))
        }
      }, {prompt: 'the-db> '})
      await this.close()
    }
  }

  return CliMixed
}

module.exports = cliMix
