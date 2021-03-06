'use strict'

const fs        = require('fs')
const path      = require('path')
const Sequelize = require('sequelize')
const pg = require('pg')

let models = {}
let loadedModels = ['user']

exports.models = models
exports.loadModels = (sequelize, modelsDir) => {
  fs
    .readdirSync(modelsDir)
    .filter((file) => (file.indexOf('.js') > 0 && file !== 'index.js'))
    .map((file) => file.substr(0, file.length-3))
    .filter((file) => loadedModels.includes(file))
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
    let connString = `${CONFIG.database.connstring}/postgres`
    let connStringDB = `${CONFIG.database.connstring}/${CONFIG.database.dbname}`
    pg.connect(connString, (err, client, done) => {
      if (err) return reject(err)
      let creationQuery = `CREATE DATABASE ${CONFIG.database.dbname}`
      client.query(creationQuery, () => {
          let sequelize = new Sequelize(connStringDB, {logging: false})
          client.end()
          return resolve(sequelize)
      })
    })
  })
}
