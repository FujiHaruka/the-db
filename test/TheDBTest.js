/**
 * Test for TheDB.
 * Runs with mocha.
 */
'use strict'

const TheDB = require('../lib/TheDB')
const {ok, equal, deepEqual} = require('assert')
const asleep = require('asleep')
const {ClayResource} = require('clay-resource')

describe('the-db', () => {
  before(() => {
  })

  after(() => {
  })

  it('The db', async () => {

    const db = new TheDB({
      env: {
        dialect: 'memory'
      }
    })

    db.on('close', () => {console.log('DB Closed')})

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
          username: {type: 'STRING', unique: true},
          passwordHash: {type: 'STRING'}
        }
      }

      static onCreate (created) {
        console.log('created', created)
      }

      static onUpdate (updated) {
        console.log('updated', updated)
      }
    }

    db.load(UserResource, 'User')

    const {User} = db.resources

    const user = await User.create({username: 'foo', password: 'hogehoge'})
    equal(user.username, 'foo')
    equal(user.passwordHash, 'h')

    equal(user.$$as, 'User')
    ok(user.$$at)

    {
      const thrown = await User.create({username: 'foo', password: 'hogehoge2'}).catch((e) => e)
      ok(thrown)
    }

    {
      const dumped = await db.dump(`${__dirname}/../tmp/testing-dump`)
      ok(dumped)
    }

    {
      let called = []
      const handlers = {
        async none (db) {
          called.push('none')
          await db.updateVersion('1.1.0')
        },
        async '1.1.0' (db) {
          called.push('1.1.0')
          await db.updateVersion('2.0.0')
        }
      }
      ok(await db.migrate(handlers))
      ok(await db.migrate(handlers))
      ok(!(await db.migrate(handlers)))
      deepEqual(called, ['none', '1.1.0'])
    }

    await asleep(300)

    await db.close()
  })
})

/* global describe, before, after, it */
