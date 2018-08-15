const puppeteer = require('puppeteer')
const logger = require('@src/winston.js')

module.exports = class Scrape {
  constructor(URL) {
    this.url = URL
    this.browser = null
    this.page = null

    return this.activate()
  }

  async activate() {
    logger.info('Scraping the web searching changes....')

    let result = []
    try {
      await this.initBrowser()
      await this.initPage()
      await this.goToURL()
      result = await this.startScraping()
      await this.closeBrowser()
    } catch (err) {
      logger.error('Scrape ERROR', err)
    } finally {
      logger.info('Finish scrape changes', { result })
    }

    return result
  }
  async initBrowser() {
    this.browser = await puppeteer.launch()
  }

  async initPage() {
    this.page = await this.browser.newPage()
  }

  async goToURL() {
    await this.page.goto(this.url)
  }

  async startScraping() {
    return require('@checkScript')(this.page)
  }

  async closeBrowser() {
    await this.browser.close()
  }
}
