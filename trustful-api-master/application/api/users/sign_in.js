'use strict'

let Users = require('../../trustful/users')

/**
 * Login a user, by returning access token.
 */
module.exports = server => {
  server.get(endpoint, (req, res, next) => {
    let email = req.params.email
    let password = req.params.password

    let token = 500 // fake token, let's use auto-increment ID here.

    res.send({
      data: {
        message: `Logged in: ${name}`,
        token: token
      }
    })
  }) 
}

let endpoint = {
  path: '/users/sign_in',
  version: '1.0.0',
  params: {
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