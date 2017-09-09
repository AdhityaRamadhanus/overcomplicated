'use strict'
const express = require('express')
const router = express.Router()
const validateReq = require('../middlewares/validate-req')
const todoHandler = require('../handler/todo')

router
  .get('/', todoHandler.getAll)
  .get('/:todoId',
    validateReq((req) => {
      req.checkParams('todoId', 'Please provide todoId').notEmpty().isInt()
      req.sanitizeParams('todoId').toInt()
    }),
    todoHandler.getById)
  .post('/create', validateReq((req) => {
    req.checkBody('title', 'Please provide Title').notEmpty()
    }),
    todoHandler.create)
  .post('/:todoId/update',
    validateReq((req) => {
      req.checkParams('todoId', 'Please provide todoId').notEmpty().isInt()
      req.sanitizeParams('todoId').toInt()
    }),
    todoHandler.update)

module.exports = router
