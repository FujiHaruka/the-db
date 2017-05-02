/**
 * Create a TheDb instance
 * @function create
 * @param {...*} args
 * @returns {TheDb}
 */
'use strict'

const TheDb = require('./TheDb')

/** @lends create */
function create (...args) {
  return new TheDb(...args)
}

module.exports = create
