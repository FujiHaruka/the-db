/**
 * Resource to manage schema
 * @class SchemaResource
 */
'use strict'

const Resource = require('./Resource')
const {STRING, DATE} = require('../DataTypes')

/** @lends SchemaResource */
class SchemaResource extends Resource {

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

module.exports = SchemaResource