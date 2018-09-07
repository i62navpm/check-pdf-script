const path = require('path')
const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@src': path.join(__dirname, '/src/'),
  '@config': path.join(__dirname, '/config/'),
  '@checkScript': path.join(__dirname, '/checkScript/'),
  '@urlFilenames': path.join(__dirname, '/urlFilenames/'),
})

const { URL } = require('@config/config.js')
const Scrape = require('@src/Scrape.js')
const PdfHandler = require('@src/PdfHandler.js')
const StorageHandler = require('@src/StorageHandler.js')
const logger = require('@src/winston.js')

async function checkResources() {
  logger.info('**** Starting to check the files ****')
  try {
    const urls = await new Scrape(URL)
    const files = await new PdfHandler(urls)
    await new StorageHandler(files)
    return files
  } catch (err) {
    logger.error(err.message)
  } finally {
    logger.info('**** Finish to check the files ****')
  }
}

module.exports = { checkResources }
