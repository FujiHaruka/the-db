'use strict'

const {unlessProduction} = require('the-check')

const noop = (v) => v
const get = (obj, namepath) => {
  if (!obj) {
    return obj
  }
  const [name, ...remain] = namepath.split('.')
  const value = obj[name]
  if (remain.length > 0) {
    return get(value, remain.join('.'))
  } else {
    return value
  }
}

const asBound = (bound = noop) => async (resource, array, actionContext) =>
  Promise.all(array.map((entry) => bound.call(resource, entry, actionContext)))

const indexBounds = (indices = []) => ({
  indexInbound: asBound((attributes) => {
    for (const name of indices) {
      attributes[name] = get(attributes, name)
    }
    return attributes
  }),
  indexOutbound: asBound((entity, actionContext) => {
    for (const name of indices) {
      if (!(name in entity)) {
        continue
      }
      const value = get(entity, name)
      const rotten = (actionContext.action !== 'one') && (entity[name] !== value)
      if (rotten) {
        unlessProduction(() => {
          console.warn(`[TheDB] Index had rotten on "${name}" for "${entity.$$as}#${entity.id}"`, {
            indexed: entity[name],
            actual: value,
          })
        })
      }
      const needsDelete = /\./.test(name)
      if (needsDelete) {
        delete entity[name]
      }
    }
    return entity
  }),
})

module.exports = {
  asBound,
  indexBounds,
}