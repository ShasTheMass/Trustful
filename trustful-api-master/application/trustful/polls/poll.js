'use strict'

let _ = require('lodash')

let Ethereum = require('../../ethereum')
let Trustful = require('..')

module.exports = class Poll {

  constructor(id, address){
    this.id = id
    this.contract = Trustful.contracts['Poll'].at(address)
  }

  get details(){
  	return new Promise((resolve, reject) => {
  		this.contract.details((err, result) => {
  			if (err) return reject(err)
  			return resolve({
    			id: this.id,
  				topic: Ethereum.utils.decode('string', result[0]),
  				firstChoice: Ethereum.utils.decode('string', result[1]),
  				secondChoice: Ethereum.utils.decode('string', result[2]),
    			contract: {
    				address: this.contract.address
    			}
  			})
  		})
  	})
  }

  get results(){
    return new Promise((resolve, reject) => {
      this.details.then(details => {
        this.contract.results((err, result) => {
          if (err) return reject(err)
          return resolve({
            id: this.id,
            topic: details.topic,
            firstChoice: details.firstChoice,
            secondChoice: details.secondChoice,
            firstChoiceVotes: Ethereum.utils.decode('number', result[0]),
            secondChoiceVotes: Ethereum.utils.decode('number', result[1]),
            contract: {
              address: this.contract.address
            }
          })
        })
      })
    })
  }

  vote(userId, choice){
    // TODO: checkVoted
  	return new Promise((resolve, reject) => {
      let selectedChoice = choice ? 1 : 0
      this.contract.vote.sendTransaction(
        Ethereum.utils.encode('number', userId),
        Ethereum.utils.encode('number', selectedChoice),
        Ethereum.transactionOptions(),
        (err, tx) => {
          if (err) return reject(err)
          return resolve(tx)
        }
      )
  	})
  }

  checkVoted(userId){
    return new Promise((resolve, reject) => {
      this.contract.checkVoted.call(
        Ethereum.utils.encode('number', userId),
        (err, hasVoted) => {
          if (err) return reject(err)
          return resolve(hasVoted)
        }
      )
    })
  }
}
