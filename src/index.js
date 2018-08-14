require('module-alias/register')
const { URL } = require('@config/config.js')
const Scrape = require('@src/Scrape.js')
const PdfHandler = require('@src/PdfHandler.js')
const StorageHandler = require('@src/StorageHandler.js')

async function main() {
  const urls = await new Scrape(URL)
  const files = await new PdfHandler(urls)
  return new StorageHandler(files)
}

main()
