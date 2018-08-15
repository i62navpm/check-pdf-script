require('module-alias/register')
const { URL } = require('@config/config.js')
const Scrape = require('@src/Scrape.js')
const PdfHandler = require('@src/PdfHandler.js')
const StorageHandler = require('@src/StorageHandler.js')
const logger = require('@src/winston.js')

async function main() {
  logger.info('**** Starting to check the files ****')
  try {
    const urls = await new Scrape(URL)
    const files = await new PdfHandler(urls)
    await new StorageHandler(files)
  } catch (err) {
    logger.error(err)
  } finally {
    logger.info('**** Finish to check the files ****')
  }
}

main()
