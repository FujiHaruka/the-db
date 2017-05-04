/**
 * Test for TheDb.
 * Runs with mocha.
 */
'use strict'

const TheDb = require('../lib/TheDb')
const { ok, equal } = require('assert')
const co = require('co')
const { ClayResource } = require('clay-resource')

describe('the-db', () => {
  before(() => {
  })

  after(() => {
  })

  it('The db', () => co(function * () {

    let db = new TheDb({
      env: {
        dialect: 'memory'
      }
    }).load([
      class UserResource extends ClayResource {
        static inbound (attributes) {
          const digest = (password) => password.slice(0, 1)
          attributes.passwordHash = digest(attributes.password)
          delete attributes.password
          return attributes
        }

        static outbound (attributes) {
          return attributes
        }

        static get policy () {
          return {
            username: { type: 'STRING', unique: true },
            passwordHash: { type: 'STRING' }
          }
        }

        static get nameString () {
          return 'User'
        }
      }
    ])

    let { User } = db.resources

    let user = yield User.create({ username: 'foo', password: 'hogehoge' })
    equal(user.username, 'foo')
    equal(user.passwordHash, 'h')

    equal(user.$$as, 'User')
    ok(user.$$at)
    let thrown
    try {
      yield User.create({ username: 'foo', password: 'hogehoge2' })
    } catch (e) {
      thrown = e
    }
    ok(thrown)
  }))
})

/* global describe, before, after, it */
