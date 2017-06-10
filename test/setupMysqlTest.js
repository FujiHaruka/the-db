/**
 * Test for setupMysql.
 * Runs with mocha.
 */
'use strict'

const setupMysql = require('../lib/helpers/setupMysql')
const { ok, equal } = require('assert')
const co = require('co')

describe('setup-mysql', () => {
  before(() => {
  })

  after(() => {
  })

  it('Do test', () => co(function * () {
    yield setupMysql({
      database: 'hoge',
      username: 'hoge',
      password: 'hoge'
    })
  }))
})

/* global describe, before, after, it */
