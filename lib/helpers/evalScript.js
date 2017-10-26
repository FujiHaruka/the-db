/**
 * @function evalScript
 */
'use strict'

function evalScript (script, options = {}) {
  const {variables, prefix = ''} = options
  const names = Object.keys(variables)
  return (new Function([...names],
    `${prefix};return (async () => (${script}))()`
  ))(...names.map((name) => variables[name]))

}

module.exports = evalScript