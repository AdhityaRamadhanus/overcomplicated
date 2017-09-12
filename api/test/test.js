'use strict'

const app = require('../server')
const models = require('../db').models
const supertest = require('supertest')
const server = supertest(app)
const assert = require('assert')
const jwt = require('jsonwebtoken')
// 'global' var

let userMockData ={
  email: 'adhitya.ramadhanus@gmail.com',
  password: 'ajegile',
  firstname: 'adhitya',
  lastname: 'ramadhanus'
}

let accessToken =

before((done) => {

  app.on('running', () => {
    console.log('API Server is ready')
    let destroyPromises = [
      models.User.destroy({
        where: {}
      }),
      models.Todo.destroy({
        where: {}
      })
    ]

    Promise.all(destroyPromises)
      .then(() => models.User.create(userMockData))
      .then((userData) => {
        let payload = {
          email: userData.dataValues.email,
          id: userData.dataValues.id,
          createdAt: new Date()
        }
        accessToken = jwt.sign(payload, CONFIG.jwt_secret_key, {expiresIn: 60*30})
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  app.on('error', (err) => {
    console.log('Failed to start API server')
    done(err)
  })
})

describe('API Todo Service Unit Test', () => {
  it('POST /todo/create Successfully create a todo ', (done) => {
    let tododata = {
      title: 'Main Hearts of Iron III',
      details: 'Main di STIM',
      due_date: new Date()
    }

    server
      .post('/todo/create')
      .set('Authorization', 'Basic ' + accessToken)
      .send(tododata)
      .expect('Content-type',/json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.notEqual(res.body.data, undefined)
        assert.equal(res.body.message, 'succesfully created!')
        assert.equal(res.body.data.title, tododata.title)
        done()
      })
  })

  it('GET /todo/ Successfully get all todo ', (done) => {
    server
      .get('/todo')
      .set('Authorization', 'Basic ' + accessToken)
      .expect('Content-type',/json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.notEqual(res.body.data, undefined)
        assert.equal(res.body.data.length, 1)
        done()
      })
  })
})

