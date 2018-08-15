const Storage = require('@google-cloud/storage')
const { BUCKET_NAME, PDF_FOLDER } = require('@config/config')
module.exports = class StorageHandler {
  constructor(files) {
    this.files = files

    this.storage = new Storage()
    return this.activate()
  }

  async activate() {
    return this.uploadFiles(this.files)
  }

  async uploadFiles(files) {
    return Promise.all(
      files.map(file =>
        this.storage.bucket(BUCKET_NAME).upload(`${PDF_FOLDER}/${file}.pdf`)
      )
    )
  }
}
