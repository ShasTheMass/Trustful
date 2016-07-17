'use strict'

let Polls = require('../../trustful/polls')

module.exports = server => {
  server.get(endpoint, (req, res, next) => {

    let id = req.params.id
    let userId = req.params.userId

    Polls.find(id)
      .then(poll => {
        return poll.details.then(details => {
          return poll.checkVoted(userId).then(hasVoted => {
            details.hasVoted = hasVoted
            return details
          })
        })
      })
      .then(poll => res.send(poll))
      .catch(err => res.send(err))
  }) 
}

let endpoint = {
  path: '/polls/:id',
  version: '1.0.0',
  params: {
    id: {
      dataTypes: ['number'],
      required: true
    },
    userId: {
      dataTypes: ['number'],
      required: true
    }
  }
}
