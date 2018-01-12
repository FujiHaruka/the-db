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
    const {interval = 300} = options
    this._targets = new Set()
    this._refreshTimer = -1
    this.inveral = interval
    this.handler = handler
  }

  start () {
    const {handler, interval} = this
    debug('start', {interval})
    if (this._refreshTimer !== -1) {
      throw new Error(`Refresh loop already started`)
    }

    const tick = (async function tickImpl () {
      if (this.closed) {
        return
      }
      for (const target of this._targets.values()) {
        debug('target', target)
        await handler(target)
        this._targets.delete(target)
      }
      setTimeout(tick, interval).unref()
    }).bind(this)

    return tick()
  }

  stop () {
    debug('stop')
    clearTimeout(this._refreshTimer)
    this._refreshTimer = -1
  }

  /** @deprecated */
  add (target) {
    console.warn('`Refresher#add` is now deprecated. Use `Refresher#request` instead.')
    this.request(target)
  }

  /** Add refresh target */
  request (target) {
    this._targets.add(target)
  }

  clear (...args) {
    super.close(...args)
    clearTimeout(this._refreshTimer)
    this._refreshTimer = -1
  }

}

module.exports = Refresher