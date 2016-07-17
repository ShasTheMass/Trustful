'use strict'

let Polls = require('../../trustful/polls')

module.exports = server => {
  server.post(endpoint, (req, res, next) => {

    let poll = {
      topic: req.params.topic,
      firstChoice: req.params.firstChoice,
      secondChoice: req.params.secondChoice
    }

    if (poll.topic == null || poll.firstChoice == null || poll.secondChoice == null){
      return res.send({
        error: 'Wrong arguments'
      })
    }
    
    Polls.create(poll)
      .then(tx => ({
        message: `Poll created successfully`,
        transaction: {
          id: tx
        }
      }))
      .then(result => res.send(result))
      .catch(err => res.send(err))
  }) 
}

let endpoint = {
  path: '/polls',
  version: '1.0.0',
  params: {
    topic: {
      dataTypes: ['string'],
      required: true
    },
    firstChoice: {
      dataTypes: ['string'],
      required: true
    },
    secondChoice: {
      dataTypes: ['string'],
      required: true
    }
  }
}
