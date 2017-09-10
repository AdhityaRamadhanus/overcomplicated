'use strict'

const bcrypt = require('bcrypt')

exports.createHashPassword = (password) => {
  let salt = bcrypt.genSaltSync(10)
  let hashPassword = bcrypt.hashSync(password, salt)
  return hashPassword
}
