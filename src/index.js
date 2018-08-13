require('module-alias/register')
const { URL } = require('@config/config.js')
const Scrape = require('@src/Scrape.js')
const HandlePdfs = require('@src/HandlePdfs.js')

async function main() {
  const urls = await new Scrape(URL)
  await new HandlePdfs(urls)
}

main()
