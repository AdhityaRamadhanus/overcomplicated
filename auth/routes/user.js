'use strict'
const express = require('express')
const router = express.Router()
const validateReq = require('../middlewares/validate-req')
const userHandler = require('../handler/user')

router
  .post('/register',
    validateReq((req) => {
      req.checkBody('email', 'Please provide valid email').isEmail()
      req.checkBody('password', 'Password is invalid').notEmpty()
      req.checkBody('firstname', 'Please provide firstname').notEmpty()
      req.checkBody('lastname', 'Please provide lastname').notEmpty()
    }),
    userHandler.register)
  .post('/login',
    validateReq((req) => {
      req.checkBody('email', 'Please provide valid email').isEmail()
      req.checkBody('password', 'Password is invalid').notEmpty()
    }),
    userHandler.login)

module.exports = router
