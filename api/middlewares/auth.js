'use strict'

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  let authHeaders = req.headers.authorization
  if (!authHeaders) return res.status(401).json({
    error: 'Authorization header not present!',
    timestamp: new Date().toISOString()
  })

  // parse authorization headers
  let scheme = _.first(_.split(authHeaders, ' '))
  let accessKey = _.nth(_.split(authHeaders, ' '), 1)

  if (!scheme || scheme !== 'Basic' || !accessKey) return res.status(401).json({
    error: 'Authorization header not valid!',
    timestamp: new Date().toISOString()
  })

  jwt.verify(accessKey, 'overcomplicated', (err, decoded) => {
    if (err) return res.status(401).json({
      error: 'Authorization header not valid!',
      timestamp: new Date().toISOString()
    })
    req.currentUser = decoded
    next()
  })
}
