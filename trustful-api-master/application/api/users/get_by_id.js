'use strict'

let Users = require('../../trustful/users')

module.exports = server => {
  server.get(endpoint, (req, res, next) => {

    let id = req.params.id

    Users.find(id)
      .then(user => user.details)
      .then(user => res.send(user))
      .catch(err => res.send(err))
  }) 
}

let endpoint = {
  path: '/users/:id',
  version: '1.0.0',
  params: {
    id: {
      dataTypes: ['number'],
      required: true
    }
  }
}
