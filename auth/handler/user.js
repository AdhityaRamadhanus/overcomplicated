'use strict'

const models = require('../db').models
const authHelper = require('../helper/auth')

exports.register = (req, res) => {
  let hashPassword = authHelper.createHashPassword(req.body.password)
  let user = req.body
  user.password = hashPassword
  models.User
    .create(user)
    .then((data) => {
      return res.status(200).json({
        message: 'succesfully registered!',
        data: data.dataValues,
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
