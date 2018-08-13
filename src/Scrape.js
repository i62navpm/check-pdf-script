const puppeteer = require('puppeteer')

module.exports = class Scrape {
  constructor(URL) {
    this.url = URL
    this.browser = null
    this.page = null

    return this.activate()
  }

  async activate() {
    await this.initBrowser()
    await this.initPage()
    await this.goToURL()
    const result = await this.startScraping()
    await this.closeBrowser()
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
