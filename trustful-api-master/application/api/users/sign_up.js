'use strict'

let Users = require('../../trustful/users')

module.exports = server => {
  server.post(endpoint, (req, res, next) => {

    let user = {
      name: req.params.name,
      email: req.params.email,
      password: req.params.password
    }
    
    Users.create(user)
      .then(tx => ({
        message: `User created successfully`,
        transaction: {
          id: tx
        }
      }))
      .then(result => res.send(result))
      .catch(err => res.send(err))
  }) 
}

let endpoint = {
  path: '/users/sign_up',
  version: '1.0.0',
  params: {
    name: {
      dataTypes: ['string'],
      required: true
    },
    email: {
      dataTypes: ['string'],
      required: true
    },
    password: {
      dataTypes: ['string'],
      required: true
    }
  }
}
