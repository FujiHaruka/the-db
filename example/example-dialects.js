'use strict'

const theDb = require('the-db')

// Using sqlite
{
  const sqlite = theDb({
    env: {
      dialect: 'sqlite', // Uses "clay-driver-sqlite" package
      storage: 'var/my-app.db' // File path to save
    },
    resources: { /* ... */ }
  })
}

// Using json
{
  const json = theDb({
    env: {
      dialect: 'json', // Uses "clay-driver-json" package
      storage: 'var/my-app.json' // File path to save
    },
    resources: { /* ... */ }
  })
}

// Using mysql
{
  const mysql = theDb({
    env: {
      dialect: 'mysql', // Uses "clay-driver-mysql" package
      database: 'my-app',
      username: 'user01',
      password: 'xxxxxxxxxxx'
    }
  })
}




