const urlFilenames = require('@urlFilenames/urlFilenames.json')
const axios = require('axios')
const fs = require('fs')
const { PDF_FOLDER } = require('@config/config')

module.exports = class PdfHandler {
  constructor(urls) {
    this.urls = urls

    return this.activate()
  }

  async activate() {
    const differentFilesSet = new Set(this.compareUrlFilenames(this.urls))
    const differentSizedSet = new Set(await this.compareFilesSize(this.urls))

    return [...new Set([...differentFilesSet, ...differentSizedSet])]
  }

  compareUrlFilenames(urls) {
    return Object.keys(urls).filter(list => urlFilenames[list] !== urls[list])
  }

  async compareFilesSize(urls) {
    const lists = []
    for (let list in urls) {
      try {
        const { data } = await this.downloadFile(urls[list])

        if (data.length !== fs.statSync(`${PDF_FOLDER}/${list}.pdf`).size)
          lists.push(list)
      } catch (err) {
        if (err.code === 'ENOENT') {
          this.saveFile(list, urls[list])
          lists.push(list)
        }
      }
    }

    return lists
  }

  async saveFile(filename, url) {
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
