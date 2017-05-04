the-db
==========

<!---
This file is generated by ape-tmpl. Do not update manually.
--->

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_shield_url]][bd_travis_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]
[![JS Standard][bd_standard_shield_url]][bd_standard_url]

[bd_repo_url]: https://github.com/the-labo/the-db
[bd_travis_url]: http://travis-ci.org/the-labo/the-db
[bd_travis_shield_url]: http://img.shields.io/travis/the-labo/the-db.svg?style=flat
[bd_travis_com_url]: http://travis-ci.com/the-labo/the-db
[bd_travis_com_shield_url]: https://api.travis-ci.com/the-labo/the-db.svg?token=
[bd_license_url]: https://github.com/the-labo/the-db/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/the-labo/the-db
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/the-labo/the-db.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/the-labo/the-db.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/the-labo/the-db
[bd_gemnasium_shield_url]: https://gemnasium.com/the-labo/the-db.svg
[bd_npm_url]: http://www.npmjs.org/package/the-db
[bd_npm_shield_url]: http://img.shields.io/npm/v/the-db.svg?style=flat
[bd_standard_url]: http://standardjs.com/
[bd_standard_shield_url]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

DB for the-framework

<!-- Description End -->


<!-- Overview Start -->
<a name="overview"></a>



<!-- Overview End -->


<!-- Sections Start -->
<a name="sections"></a>

<!-- Section from "doc/guides/01.Installation.md.hbs" Start -->

<a name="section-doc-guides-01-installation-md"></a>

Installation
-----

```bash
$ npm install the-db --save
```


<!-- Section from "doc/guides/01.Installation.md.hbs" End -->

<!-- Section from "doc/guides/02.Usage.md.hbs" Start -->

<a name="section-doc-guides-02-usage-md"></a>

Usage
---------

### Basic Usage

```javascript
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



```


### Dialect Examples

`env.dialect` option decides where to store data with Clay-Driver.

```javascript
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





```


<!-- Section from "doc/guides/02.Usage.md.hbs" End -->

<!-- Section from "doc/guides/10.API Guide.md.hbs" Start -->

<a name="section-doc-guides-10-a-p-i-guide-md"></a>

API Guide
-----

+ [the-db@1.0.5](./doc/api/api.md)
  + [create(args)](./doc/api/api.md#the-db-function-create)
  + [TheDb](./doc/api/api.md#the-db-class)


<!-- Section from "doc/guides/10.API Guide.md.hbs" End -->


<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [MIT License](https://github.com/the-labo/the-db/blob/master/LICENSE).

<!-- LICENSE End -->


<!-- Links Start -->
<a name="links"></a>

Links
------

+ [THE Labo][t_h_e_labo_url]

[t_h_e_labo_url]: https://github.com/the-labo

<!-- Links End -->
