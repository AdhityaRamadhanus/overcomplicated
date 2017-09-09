'use strict'

const fs        = require('fs')
const path      = require('path')
const Sequelize = require('sequelize')
const pg = require('pg')
let models = {}
exports.models = models
exports.loadModels = (sequelize, modelsDir) => {
  fs
    .readdirSync(modelsDir)
    .filter((file) => (file.indexOf('.js') > 0 && file !== 'index.js'))
    .forEach((file) => {
      let model = sequelize.import(path.join(modelsDir, file))
      logger.info('Loading models', model.name)
      models[model.name] = model
    })

  Object.keys(models).forEach((modelName) => {
    if ("associate" in models[modelName]) {
      models[modelName].associate(models)
    }
  })
}

exports.init = () => {
  return new Promise((resolve, reject) => {
    let connString = 'postgres://postgres:cihuy@localhost:5432/postgres'
    let connStringDB = 'postgres://postgres:cihuy@localhost:5432/todo'
    pg.connect(connString, (err, client, done) => {
      if (err) return reject(err)
      client.query('CREATE DATABASE todo', () => {
          let sequelize = new Sequelize(connStringDB, {logging: false})
          client.end()
          return resolve(sequelize)
      })
    })
  })
}
