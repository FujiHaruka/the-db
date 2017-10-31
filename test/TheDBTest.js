/**
 * Test for TheDB.
 * Runs with mocha.
 */
'use strict'

const TheDB = require('../lib/TheDB')
const {ok, equal, deepEqual} = require('assert')
const asleep = require('asleep')

describe('the-db', function () {
  this.timeout(20 * 1000)
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

    class UserResource extends TheDB.Resource {
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
        },
        async '2.0.0' (db) {
          called.push('2.0.0')
          await db.updateVersion('3.0.0')
        }
      }
      ok(await db.migrate(handlers))
      ok(await db.migrate(handlers))
      ok(await db.migrate(handlers))
      ok(!(await db.migrate(handlers)))
      deepEqual(called, ['none', '1.1.0', '2.0.0'])
    }

    await asleep(100)

    for (let i = 0; i < 10; i++) {
      await db.resource('Ball').create({name: 'ball-' + i})
    }

    const dataDir = `${__dirname}/../tmp/foo/exports`
    await db.export(dataDir)
    await db.import(dataDir)

    await asleep(300)

    await db.drop()
    await db.close()
  })

  it('Mysql', async () => {
    const env = {
      dialect: 'mysql',
      username: 'hoge',
      password: 'fuge',
      database: 'abc'
    }
    const db = new TheDB({
      env
    })

    await db.setup()

    await db.exec('SHOW TABLES;')

    await db.drop()
    await db.close()
  })

  it('Sqlite', async () => {
    const env = {
      dialect: 'sqlite',
      storage: `${__dirname}/../tmp/sqlite-testing/test.db`
    }
    const db = new TheDB({
      env
    })

    await db.setup()

    await db.exec('.help')

    await db.drop()
    await db.close()
  })

  it('Use refresh loop', async () => {
    const {Resource, Refresher} = TheDB
    const db = new TheDB({})

    class UserResource extends Resource {

    }

    db.load(UserResource, 'User')

    const {User} = db.resources
    const refresher = new Refresher(
      (entity) => {
        refreshed.push(entity)
      },
      {interval: 10}
    )
    const refreshed = []
    await refresher.start()

    const [user01, user02, user03] = await User.createBulk([
      {name: 'user01'},
      {name: 'user02'},
      {name: 'user03'}
    ])

    refresher.add(user01)
    refresher.add(user02)

    await asleep(250)

    await refresher.stop()

    equal(refreshed.length, 2)

    await db.close()
  })
})

/* global describe, before, after, it */
