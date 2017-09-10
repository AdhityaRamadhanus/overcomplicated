'use strict'

module.exports = (registerValidator) => {
  return async function (req, res, next) {
    registerValidator(req)
    let errors = await req.getValidationResult()
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.mapped(),
        timestamp: new Date().toISOString(),
      })
    }
    return next()
  }
}
