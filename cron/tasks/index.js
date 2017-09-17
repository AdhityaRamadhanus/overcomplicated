'use strict'

let emailReminderTask = require('./email-reminder')

exports.startJob = () => {
  emailReminderTask.start()
}
