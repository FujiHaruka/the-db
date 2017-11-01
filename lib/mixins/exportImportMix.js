/**
 * Add export/import methods
 * @function exportImportMix
 */
'use strict'

const amkdirp = require('amkdirp')
const aslogger = require('aslogger')
const asleep = require('asleep')
const path = require('path')
const {promisify, inspect} = require('util')

const readline = require('readline')
const fs = require('fs')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const appendFileAsync = promisify(fs.appendFile)
const statAsync = promisify(fs.stat)
const {encode, decode} = require('msgpack5')()
const {EOL} = require('os')
const INFO_FILE_NAME = 'info.json'
const {serialize, deserialize} = require('clay-serial')

/** @lends exportImportMix */
function exportImportMix (Class) {
  class ExportImportMixed extends Class {
    async export (dirname) {
      const s = this
      const logger = aslogger({})
      await amkdirp(dirname)
      const infoFilePath = path.join(dirname, INFO_FILE_NAME)
      const {resources} = s
      const resourcesInfo = {}
      for (const [rName, resource] of Object.entries(resources)) {
        const filename = path.join(dirname, rName + '.dat')
        await writeFileAsync(filename, '')
        logger.point(`Exporting "${rName}"...`)
        let length = 0
        await resource.each(async (entity) => {
          const id = String(entity.id)
          const attributes = Object.assign({}, entity)
          delete attributes.id
          const line = encode({
            id,
            attributes: serialize.all(attributes)
          }).toString('hex')
          await appendFileAsync(filename, line + EOL)
          length++
        })
        resourcesInfo[rName] = {
          filename,
          resource: rName,
          length,
          at: new Date()
        }
        logger.debug('File exported ', path.relative(process.cwd(), filename))
      }
      const info = {
        resources: resourcesInfo,
        exportedAt: new Date()
      }
      await writeFileAsync(infoFilePath, JSON.stringify(info, null, 2))
      await asleep(10) // Wait to flush
    }

    async import (dirname) {
      const s = this
      const logger = aslogger({})
      const infoFilePath = path.join(dirname, INFO_FILE_NAME)
      const hasInfo = !!await statAsync(infoFilePath).catch(() => null)
      if (!hasInfo) {
        throw new Error(`No info found`, dirname)
      }
      const info = JSON.parse(String(await readFileAsync(infoFilePath)))

      const {resources: resourcesInfo} = info
      for (const [rName, rInfo] of Object.entries(resourcesInfo)) {
        const resource = s.resource(rName)
        logger.point(`Importing "${rName}"...`)
        const {filename} = rInfo
        let work = null
        await new Promise((resolve, reject) => {
          const reader = readline.createInterface({
            input: fs.createReadStream(filename)
          })
          reader.on('line', (line) => {
            work = Promise.resolve(work).then(async () => {
              let {id, attributes} = decode(Buffer.from(line, 'hex'))
              attributes = deserialize.all(attributes)
              const known = await resource.one(id)
              if (known) {
                const isNewer = new Date(known.$$at) < new Date(attributes.$$at)
                if (isNewer) {
                  await resource.update(id, attributes, {allowReserved: true})
                }
              } else {
                const values = Object.assign({id}, attributes)
                await resource.create(values, {allowReserved: true})
              }
            })
          })
          reader.on('close', () => resolve())
          reader.on('error', (err) => reject(err))
        })
        await work
      }
      await asleep(10) // Wait to flush
    }
  }

  return ExportImportMixed
}

module.exports = exportImportMix
