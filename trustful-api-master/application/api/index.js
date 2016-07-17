'use strict'

/**
 * API index.
 */
module.exports = server => {
  server.get(endpoint, (req, res, next) => {
    res.send('API index')
  }) 
}

let endpoint = {
  path: '/',
  version: '1.0.0',
  params: {}
}
