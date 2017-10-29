/**
 * Resource refresher
 * @class Refresher
 */
'use strict'

const {EventEmitter} = require('events')
const debug = require('debug')('the:db:refresher')

/** @lends Refresher */
class Refresher extends EventEmitter {
  constructor (handler, options = {}) {
    super()
    const s = this
    const {interval = 300} = options
    s._targets = new Set()
    s._refreshTimer = -1
    s.inveral = interval
    s.handler = handler
  }

  start () {
    const s = this
    const {handler, interval} = s
    debug('start', {interval})
    if (s._refreshTimer !== -1) {
      throw new Error(`Refresh loop already started`)
    }

    async function tick () {
      if (s.closed) {
        return
      }
      for (const target of s._targets.values()) {
        debug('target', target)
        await handler(target)
        s._targets.delete(target)
      }
      setTimeout(tick, interval).unref()
    }

    return tick()
  }

  stop () {
    const s = this
    debug('stop')
    clearTimeout(s._refreshTimer)
    s._refreshTimer = -1
  }

  /** Add refresh target */
  add (target) {
    const s = this
    s._targets.add(target)
  }

  clear (...args) {
    const s = this
    super.close(...args)
    clearTimeout(s._refreshTimer)
    s._refreshTimer = -1
  }

}

module.exports = Refresher