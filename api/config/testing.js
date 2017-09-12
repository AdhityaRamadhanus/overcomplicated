'use strict'

let config = {
  database: {
    connstring: 'postgres://postgres:imperialeagle@localhost:5432',
    dbname: 'overcomplicated_test'
  },
  jwt_secret_key: process.env.JWT_SECRET_KEY || 'overcomplicated'
}

module.exports = config
