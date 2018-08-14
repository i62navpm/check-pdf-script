const Storage = require('@google-cloud/storage')

module.exports = class StorageHandler {
  constructor(files) {
    this.files = files

    this.storage = new Storage()
    this.activate()
  }

  activate() {}
}
