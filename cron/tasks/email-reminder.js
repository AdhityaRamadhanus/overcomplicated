'use strict'

const cron = require('cron')
const models = require('../db').models

let dateFns = require('date-fns')

let job = new cron.CronJob({
  cronTime: '* * * * *',
  onTick: function() {
    let query = {
      where: {
        due_date: {
          $gt:  dateFns.format(new Date()),
          $lte: dateFns.format(dateFns.addHours(new Date(), 1))
        },
        completed: false
      }
    }
    console.log(query)
    models.Todo
      .findAll(query)
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.error(err)
      })
  },
  start: false,
  timeZone: 'Asia/Jakarta'
});

module.exports = job
