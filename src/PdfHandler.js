const urlFilenames = require('@urlFilenames/urlFilenames.json')
const axios = require('axios')
const fs = require('fs')
const { PDF_FOLDER } = require('@config/config')
const logger = require('@src/winston.js')

module.exports = class PdfHandler {
  constructor(urls) {
    this.urls = urls

    return this.activate()
  }

  async activate() {
    logger.info('Handling the pdfs to search changes....')

    let result = []
    try {
      const differentFilesSet = new Set(this.compareUrlFilenames(this.urls))
      const differentSizedSet = new Set(await this.compareFilesSize(this.urls))
      result = [...new Set([...differentFilesSet, ...differentSizedSet])]

      for (const list of result) {
        await this.saveFile(list, this.urls[list])
      }
    } catch (err) {
      logger.error('Pdf handle ERROR', err)
    } finally {
      logger.info('Finish handle searching changes', { result })
    }

    return result
  }

  compareUrlFilenames(urls) {
    logger.info(`Looking at the url`)
    return Object.keys(urls).filter(list => urlFilenames[list] !== urls[list])
  }

  async compareFilesSize(urls) {
    const lists = []
    for (let list in urls) {
      try {
        logger.info(`Downloading the file [${list}]`)
        const { data } = await this.downloadFile(urls[list])

        logger.info(`Looking at the size [${list}]`)
        if (data.length !== fs.statSync(`${PDF_FOLDER}/${list}.pdf`).size)
          lists.push(list)
      } catch (err) {
        if (err.code === 'ENOENT') {
          lists.push(list)
        }
      }
    }

    return lists
  }

  async saveFile(filename, url) {
    logger.info(`Saving the file [${filename}] in disk`)
    const result = await this.downloadFile(url)

    fs.writeFileSync(`${PDF_FOLDER}/${filename}.pdf`, result.data)
    return filename
  }

  async downloadFile(url) {
    return axios.request({
      responseType: 'arraybuffer',
      url,
      method: 'get',
    })
  }
}
