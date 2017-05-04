'use strict'

const theDb = require('the-db')
const { Resource, DataTypes } = theDb
const { STRING } = DataTypes

// Define a resource class
// See https://github.com/realglobe-Inc/clay-resource for more detail
class UserResource extends Resource {
  // Convert entity attributes on inbound
  static inbound (attributes) {
    const digest = (password) => { /* ... */ }
    attributes.passwordHash = digest(attributes.password)
    return attributes
  }

  // Convert entity attributes on outbound
  static outbound (attributes) {
    delete attributes.password
    return attributes
  }

  // Resource policy
  // https://github.com/realglobe-Inc/clay-policy#usage
  static get policy () {
    return {
      username: { type: STRING },
      password: { type: STRING }
    }
  }

  static get nameString () {
    return 'User'
  }

  // Enhance entity class
  static entityClass (ResourceEntity) {
    return class UserResourceEntity extends ResourceEntity {
      get fullName () {
        let { firstName, lastName } = this
        return [ firstName, lastName ].filter(Boolean).join(' ')
      }
    }
  }
}

const db = theDb({
  env: {
    dialect: 'sqlite', // Uses "clay-driver-sqlite" package
    storage: 'var/my-app.db' // File path to save
  }
}).load({
  userResource: UserResource
})

// Using defined database

async function tryExample () {
  // Use the connected resource
  const { userResource } = db.resources
  let user = await userResource.create({ username: 'Black Fire', password: 'Super Cool' })
  /* ... */
}

tryExample().catch((err) => console.error(err))


