'use strict'

let _ = require('lodash')

let Polls = require('../../trustful/polls')

module.exports = server => {
  server.get(endpoint, (req, res, next) => {

    let userId = req.params.userId

    Polls.findAll()
      .then(polls => {
      	let calls = _.map(polls, poll => {
	        return poll.details.then(details => {
	          return poll.checkVoted(userId).then(hasVoted => {
	            details.hasVoted = hasVoted
	            return details
	          })
	        })
	  	})
      	return Promise.all(calls)
      })
      .then(polls => res.send(polls))
      .catch(err => res.send(err))
  }) 
}

let endpoint = {
  path: '/polls',
  version: '1.0.0',
  params: {
  	userId: {
  		dataTypes: ['number'],
  		required: true
  	}
  }
}
