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
    delete attributes.password
    return attributes
  }

  // Convert entity attributes on outbound
  static outbound (attributes) {
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
}

const db = theDb({
  env: {
    dialect: 'sqlite', // Uses "clay-driver-sqlite" package
    storage: 'var/my-app.db' // File path to save
  },
  resources: {
    User: UserResource
  }
})

// Using defined database

async function tryExample () {
  // Use the connected resource
  const userResource = db.resource('User')
  let user = await userResource.create({ username: 'Black Fire', password: 'Super Cool' })
  /* ... */
}

tryExample().catch((err) => console.error(err))


