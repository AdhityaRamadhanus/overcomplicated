'use strict'

const winston = require('winston')
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser')
const routeHelper = require('./helper/route')
const storage = require('./db')

const app = express()

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

logger.stream = {
  write: (message, encoding) => {
    logger.info(message)
  }
}

if (process.env.NODE_ENV === 'testing') {
  // turn off logger
  logger.transports.console.level = 'error';
  logger.transports.file.level = 'error';
}

app.set('port', process.env.PORT || 8000)
app.set('env', process.env.NODE_ENV || 'development')

app.use(morgan('tiny', { 'stream': logger.stream }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

routeHelper.loadFS(path.join(__dirname, 'routes'), app)

storage
  .init()
  .then((sequelize) => {
    global.sequelize = sequelize
    storage.loadModels(sequelize, path.join(__dirname, '..', 'models'))
    return sequelize.sync()
  })
  .then(() => {
    app.listen(app.get('port'), 'localhost', () => {
      app.emit('running')
      logger.info('Api server is running')
    })
  })
  .catch((err) => {
    app.emit('error', err)
    logger.error(err)
  })

module.exports = app
