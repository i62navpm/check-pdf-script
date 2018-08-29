const { createLogger, format, transports } = require('winston')
const { combine, timestamp, json, colorize } = format

const options = {
  file: {
    level: 'info',
    filename: `./log/appCheck.log`,
    format: combine(timestamp(), json()),
    handleExceptions: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: format.combine(colorize(), format.simple()),
  },
}

let logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false,
})

module.exports = logger
