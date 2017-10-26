/**
 * @function createTerminal
 */
'use strict'

const readline = require('readline')
const {inspect} = require('util')

/** @lends createTerminal */
async function createTerminal (handler, options = {}) {
  const {prompt = '>'} = options
  return new Promise((resolve, reject) => {
    const r = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt
    })

    r.on('line', (line) => {
      Promise.resolve(handler(String(line).trim()))
        .then((result) => {
          if (result) {
            console.log(inspect(result))
          }
          next()
        })
        .catch((e) => {
          console.log(inspect(e))
          next()
        })
    })

    r.on('close', () => resolve())
    r.on('error', (e) => reject(e))

    const next = () => setTimeout(() => r.prompt(), 1)
    next()
  })
}

module.exports = createTerminal