'use strict'

let config = {
  database: {
    connstring: 'postgres://postgres:imperialeagle@localhost:5432',
    dbname: 'overcomplicated'
  },
  jwt_secret_key: process.env.JWT_SECRET_KEY || 'overcomplicated'
}

module.exports = config
