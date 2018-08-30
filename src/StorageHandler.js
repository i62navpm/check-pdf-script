const Storage = require('@google-cloud/storage')
const { BUCKET_NAME, BUCKET_PDF_TMP } = require('@config/config')
const logger = require('@src/winston.js')

module.exports = class StorageHandler {
  constructor(files) {
    this.files = files

    this.storage = new Storage()
    return this.activate()
  }

  async activate() {
    let result = []
    try {
      logger.info('Handling the uploaded files....')
      result = await this.uploadFiles(this.files)
    } catch (err) {
      logger.error('Files handle ERROR', err)
    } finally {
      logger.info('Finish handle uploading files')
    }

    return result
  }

  async uploadFiles(files) {
    return Promise.all(
      files.map(file =>
        this.storage
          .bucket(BUCKET_NAME)
          .upload(`${BUCKET_PDF_TMP}/${file}.pdf`)
          .then(() => {
            logger.info(`[${file}] uploaded to ${BUCKET_NAME}.`)
          })
          .catch(err => {
            logger.error('Uplaod ERROR', err)
          })
      )
    )
  }
}
