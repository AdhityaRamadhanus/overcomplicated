'use strict'

const ajv = require('ajv')()

module.exports = (schema) => {
  let validate = ajv.compile(schema)

  return function (req, res, next) {
    if (validate(req.body)) return next()
    return res.status(400).json({
      error: validate.errors[0].message,
      timestamp: new Date().toISOString()
    })
  }
}
