'use strict'

const app = require('../server')
const models = require('../db').models
const supertest = require('supertest')
const server = supertest(app)
const assert = require('assert')

before((done) => {

  app.on('running', () => {
    console.log('Authentication Server is ready')
    let promises = [
      models.User.destroy({
        where: {},
        truncate: true
      })
    ]

    Promise.all(promises)
      .then(() => {
        done()
      })
  })

  app.on('error', (err) => {
    console.log('Failed to start authentication server')
    done(err)
  })
})

describe('Authentication Service Unit Test', () => {
  it('POST /user/register Successfully register a user ', (done) => {
    let userdata = {
      email: 'adhitya.ramadhanus@gmail.com',
      firstname: 'adhitya',
      lastname: 'ramadhanus',
      password: 'testaja'
    }

    server
      .post('/user/register')
      .send(userdata)
      .expect('Content-type',/json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.notEqual(res.body.data, undefined)
        assert.equal(res.body.message, 'succesfully registered!')
        assert.equal(res.body.data.email, 'adhitya.ramadhanus@gmail.com')
        assert.notEqual(res.body.data.token, undefined)
        done()
      })
  })

  it('POST /user/login Successfully logged in a user ', (done) => {
    let userdata = {
      email: 'adhitya.ramadhanus@gmail.com',
      password: 'testaja'
    }

    server
      .post('/user/login')
      .send(userdata)
      .expect('Content-type',/json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.notEqual(res.body.data, undefined)
        assert.equal(res.body.message, 'succesfully logged in!')
        assert.notEqual(res.body.data.token, undefined)
        done()
      })
  })

})

