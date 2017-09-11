'use strict'
const express = require('express')
const router = express.Router()
const validateReq = require('../middlewares/validate-req')
const todoHandler = require('../handler/todo')
const auth = require('../middlewares/auth')

router
  .all('*', auth)
  .get('/', todoHandler.getAll)
  .get('/:todoId',
    validateReq((req) => {
      req.checkParams('todoId', 'Please provide todoId').notEmpty().isInt()
    }),
    todoHandler.getById)
  .post('/create', validateReq((req) => {
      req.checkBody('title', 'Please provide Title').notEmpty()
      req.checkBody('details', 'Please provide details').notEmpty()
      if (req.body.due_date) req.checkBody('due_date', 'Please provide ISO Date').custom((val) => !isNaN(Date.parse(val)))
    }),
    todoHandler.create)
  .post('/:todoId/update',
    validateReq((req) => {
      req.checkParams('todoId', 'Please provide todoId').notEmpty().isInt()
    }),
    todoHandler.update)

module.exports = router
