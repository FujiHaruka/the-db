/**
 * Resource to manage schema
 * @class TheSchemaResource
 */
'use strict'

const {TheResource, DataTypes} = require('the-resource-base')

const {STRING, DATE} = DataTypes

/** @lends TheSchemaResource */
class TheSchemaResource extends TheResource {

  async current () {
    const Schema = this
    const latest = await Schema.first({}, {sort: ['-createdAt']})
    if (latest) {
      return latest
    }
    return Schema.create({})
  }

  static get policy () {
    return {
      version: {
        type: STRING,
        description: 'Schema version string',
        required: true,
        unique: true,
        default: () => 'none'
      },
      createdAt: {
        type: DATE,
        description: 'Date schema created at',
        required: true,
        default: () => new Date()
      },
      migratedAt: {
        type: DATE,
        description: 'Date migrated'
      }
    }

  }
}

module.exports = TheSchemaResource