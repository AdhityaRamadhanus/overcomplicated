'use strict'

const winston = require('winston')
const path = require('path')
const storage = require('./db')
const cronTasks = require('./tasks')
// Dangerous
global._ = require('lodash')
global.logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      timestamp: true,
      level: 'info'
    }),
    new winston.transports.File({
      filename: 'overcomplicated-error.log',
      level: 'error'
    })
  ],
  exitOnError: false
})


if (process.env.NODE_ENV === 'testing') {
  // turn off logger
  logger.transports.console.level = 'error';
  logger.transports.file.level = 'error';
  // set config
  global.CONFIG = require('./config/testing')
} else if (process.env.NODE_ENV === 'production') {
  // set config
  global.CONFIG = require('./config/production')
} else {
  // set config
  global.CONFIG = require('./config/development')
}

logger.stream = {
  write: (message, encoding) => {
    logger.info(message)
  }
}

storage
  .init()
  .then((sequelize) => {
    global.sequelize = sequelize
    storage.loadModels(sequelize, path.join(__dirname, '..', 'models'))
    return sequelize.sync()
  })
  .then(() => {
    cronTasks.startJob()
  })
  .catch((err) => {
    logger.error(err)
  })
