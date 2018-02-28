/**
 * Test for TheDB.
 * Runs with mocha.
 */
'use strict'

const TheDB = require('../lib/TheDB')
const {ok, equal, deepEqual} = require('assert')
const asleep = require('asleep')
const {TheResource} = require('the-resource-base')
const {TheRefresher} = require('the-refresher')

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
      },
      resources: {
        Hoge: TheResource
      },
      hooks: {
        Hoge: (db) => ({
          onCreate (created) {
            ok(created)
          }
        })
      },
      plugins: {
        foo: (db) => () => 'foo'
      }
    })

    db.on('close', () => {console.log('DB Closed')})

    class UserResource extends TheResource {
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

    equal(db.plugins.foo(), 'foo')

    await db.drop()
    await db.close()
  })

  it('Mysql', async () => {
    const env = {
      dialect: 'mysql',
      username: 'hoge',
      password: 'fuge',
      database: 'the-db-test-abc'
    }
    const db = new TheDB({
      env
    })

    await db.setup()
    await db.exec('SHOW TABLES')
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
    const db = new TheDB({})

    class UserResource extends TheResource {

    }

    db.load(UserResource, 'User')

    const {User} = db.resources
    const refresher = new TheRefresher(
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

    refresher.request(user01)
    refresher.request(user02)

    await asleep(250)

    await refresher.stop()

    equal(refreshed.length, 2)

    await db.close()
  })

  it('Nested search', async () => {
    const env = {
      dialect: 'memory',
    }
    const db = new TheDB({env})

    class UserResource extends TheResource {
      static get indices () {
        return [
          'profile.name',
          'profile.email'
        ]
      }
    }

    class ProfileResource extends TheResource {

    }

    const User = db.load(UserResource, 'User')
    const Profile = db.load(ProfileResource, 'Profile')

    const user = await User.create({name: 'user01'})
    const profile = await Profile.create({name: 'User 01', email: 'u01@example.com'})
    await user.update({profile})

    ok(
      await User.first({'profile.email': 'u01@example.com'})
    )
    ok(
      !await User.first({'profile.email': 'u02@example.com'})
    )

    await profile.update({email: 'u02@example.com'})

    ok(
      await User.first({'profile.email': 'u01@example.com'})
    )
    ok(
      !await User.first({'profile.email': 'u02@example.com'})
    )

    await user.update({profile})
    await user.save()

    ok(
      !await User.first({'profile.email': 'u01@example.com'})
    )
    ok(
      await User.first({'profile.email': 'u02@example.com'})
    )

    await db.setup()

    await db.drop()
    await db.close()
  })

  it('Invalidate mix', async () => {
    const env = {
      dialect: 'memory',
      refreshInterval: 10,
    }
    const db = new TheDB({env})

    class ArticleResource extends TheResource {
      async refresh (entity) {
        const {db: {resources: {Star}}} = this
        await entity.update({
          starCount: await Star.count({target: entity})
        })
      }

      static get policy () {
        return {
          starCount: {type: 'NUMBER', default: () => 0}
        }
      }
    }

    class StarResource extends TheResource {
      static get policy () {
        return {
          target: {type: 'ENTITY'}
        }
      }
    }

    const Article = db.load(ArticleResource, 'Article')
    const Star = db.load(StarResource, 'Star')

    const article01 = await Article.create({name: 'a01'})
    await Star.create({target: article01})

    await db.invalidate(article01.toRef())

    await asleep(100)
    await article01.sync()
    equal(article01.starCount, 1)

  })

  it('Cascade', async () => {
    const env = {
      dialect: 'memory',
      refreshInterval: 10,
    }

    class AResource extends TheResource {
      static get cascaded () {
        return {
          B: (b) => ({b})
        }
      }
    }

    class BResource extends TheResource {}

    const db = new TheDB({
      env,
      resources: {A: AResource, B: BResource}
    })
    const {A, B} = db.resources
    const b01 = await B.create({name: 'b01'})
    const b02 = await B.create({name: 'b02'})
    await A.create({b: b01})
    await A.create({b: b02})
    equal(await A.count(), 2)

    await b01.destroy()
    await asleep(100)
    equal(await A.count(), 1)
  })
})

/* global describe, before, after, it */
