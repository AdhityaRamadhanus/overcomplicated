/* global logger */
'use strict'
const fs = require('fs')
const path = require('path')

module.exports.loadFS = (dirName, app) => {
  let listFiles = fs.readdirSync(dirName)
  let filteredList = _.filter(listFiles, (file) => {
    return (file.indexOf('.js') > 0)
  })

  _.forEach(filteredList, (module) => {
    let cleanModule = _.toLower(_.replace(module, '.js', ''))
    let routeName = cleanModule
    if (routeName === 'index') {
      routeName = '/'
    } else {
      routeName = '/' + cleanModule
    }
    app.use(routeName, require(path.join(dirName, cleanModule)))
    logger.info('Route', routeName, 'loaded')
  })
}
