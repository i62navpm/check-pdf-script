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
      await this.closeBrowser()
      logger.error('Scrape ERROR', err)
      throw new Error(err)
    } finally {
      logger.info('Finish scrape changes', { result })
    }

    return result
  }
  async initBrowser() {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    })
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
