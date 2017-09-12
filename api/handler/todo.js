'use strict'

const util = require('util')
const models = require('../db').models

exports.getAll = (req, res, next) => {
  let limit = parseInt(req.query.limit) || 10
  let page = parseInt(req.query.page) || 0
  let query = {
    limit: limit,
    offset: page * limit,
    where: {
      userId: req.currentUser.id
    }
  }
  models.Todo
    .findAll(query)
    .then((todos) => {
      return res.status(200).json({
        data: todos,
        timestamp: new Date().toISOString(),
      })
    }).catch((err) => {
      return res.status(500).json({
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      })
    })
}

exports.getById = async (req, res, next) => {
  let query = {
    where: {
      id: req.params.todoId
    }
  }

  models.Todo
    .findOne(query)
    .then((todo) => {
      if (!todo) {
        return res.status(404).json({
          message: 'Cannot find todo',
          timestamp: new Date().toISOString(),
        })
      }
      return res.status(200).json({
        data: todo,
        timestamp: new Date().toISOString(),
      })
    }).catch((err) => {
      logger.error(err)
      return res.status(500).json({
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      })
    })
}

exports.create = (req, res, next) => {
  let todoObj = req.body
  todoObj.userId = req.currentUser.id
  models.Todo
    .create(todoObj)
    .then((data) => {
      return res.status(200).json({
        message: 'succesfully created!',
        data: data.dataValues,
        timestamp: new Date().toISOString(),
      })
    })
    .catch((err) => {
      logger.error(err)
      return res.status(500).json({
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      })
    })
}

exports.update = (req, res, next) => {
  let updateData = {}
  if (req.body.title) updateData.title = req.body.title
  if (req.body.due_date) updateData.due_date = req.body.due_date
  if (req.body.completed) updateData.completed = req.body.completed

  let query = {
    where:{
      id: req.params.todoId
    }
  }
  models.Todo
    .update(
      updateData,
      query
    )
    .then((result) => {
      return res.status(200).json({
        message: 'succesfully updated',
        timestamp: new Date().toISOString(),
      })
    })
    .catch((err) => {
      logger.error(err)
      return res.status(500).json({
        error: err,
        timestamp: new Date().toISOString(),
      })
    })
}

