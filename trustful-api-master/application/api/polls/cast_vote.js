'use strict'

let Users = require('../../trustful/users')
let Polls = require('../../trustful/polls')

module.exports = server => {
  server.post(endpoint, (req, res, next) => {

    let pollId = req.params.pollId
    let userId = req.params.userId
    let choice = req.params.choice

    Users.find(userId)
      .then(user => {

        Polls.find(pollId)
          .then(poll => poll.vote(userId, choice))
          .then(tx => ({
            message: `Vote casted successfully`,
            transaction: {
              id: tx
            }
          }))
          .then(result => res.send(result))
          .catch(err => res.send(err))
      })
      .catch(err => res.send(err))
  }) 
}

let endpoint = {
  path: '/polls/:pollId/vote',
  version: '1.0.0',
  params: {
    pollId: {
      dataTypes: ['number'],
      required: true
    },
    userId: {
      dataTypes: ['number'],
      required: true
    },
    choice: {
      dataTypes: ['boolean'],
      required: true
    }
  }
}
