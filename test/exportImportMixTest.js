/**
 * Test for exportImportMix.
 * Runs with mocha.
 */
'use strict'

const TheDB = require('../lib/TheDB')
// const exportImportMix = require('../lib/mixins/exportImportMix')
const { ok, equal } = require('assert')
const {TheResource} = require('the-resource-base')

describe('export-import-mix', function () {
  this.timeout(10000)
  let db

  before(async () => {
    db = new TheDB({
      env: {
        dialect: 'sqlite',
        storage: `${__dirname}/../tmp/exp-imp-test/test.db`
      },
    })

    class UserResource extends TheResource {
      static get policy () {
        return {
          name: {type: 'STRING'},
        }
      }
    }

    db.load(UserResource, 'User')
  })

  after(async () => {
    await db.drop()
    await db.close()
  })

  it('Do test', async () => {
    const {User} = db.resources

    const DATA_COUNT = 1234

    const users = new Array(DATA_COUNT).fill(null).map((_, i) => ({name: String(i)}))
    await User.createBulk(users)

    const dataDir = `${__dirname}/../tmp/exp-imp-test/data`

    await db.export(dataDir)
    await db.drop()
    await db.import(dataDir)

    equal(await User.count(), DATA_COUNT)

  })
})

/* global describe, before, after, it */
