'use strict'

const jwt = require('jsonwebtoken')
const models = require('../db').models
const authHelper = require('../helper/auth')

exports.register = (req, res) => {
  let hashPassword = authHelper.createHashPassword(req.body.password)
  let user = req.body
  user.password = hashPassword
  models.User
    .create(user)
    .then((data) => {

      let payload = {
        email: data.dataValues.email,
        id: data.dataValues.id,
        createdAt: new Date()
      }
      let token = jwt.sign(payload, process.env.JWT_SECRET_KEY || 'overcomplicated', {expiresIn: 60*30})

      return res.status(200).json({
        message: 'succesfully registered!',
        data: {
          email: data.dataValues.email,
          id: data.dataValues.id,
          token: token
         },
        timestamp: new Date().toISOString(),
      })
    })
    .catch((err) => {
      logger.error(err)
      if (err.name === 'SequelizeUniqueConstraintError') return res.status(500).json({error: err.errors, timestamp: new Date().toISOString(),})
      return res.status(500).json({
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      })
    })
}

exports.login = (req, res) => {
  let plainPassword = req.body.password
  let email = req.body.email
  let query = {
    where: {
      email: email.toLowerCase()
    }
  }

  models.User
    .findOne(query)
    .then((data) => {
      let payload = {
        email: data.dataValues.email,
        id: data.dataValues.id,
        createdAt: new Date()
      }
      let token = jwt.sign(payload, process.env.JWT_SECRET_KEY || 'overcomplicated', {expiresIn: 60*30})
      return res.status(200).json({
        message: 'succesfully logged in!',
        data: {
          token: token
        },
        timestamp: new Date().toISOString(),
      })
    })
    .catch((err) => {
      logger.error(err)
      if (err.name === 'SequelizeUniqueConstraintError') return res.status(500).json({error: err.errors, timestamp: new Date().toISOString(),})
      return res.status(500).json({
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      })
    })
}
