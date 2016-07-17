'use strict'

let _ = require('lodash')

let Ethereum = require('../../ethereum')
let Trustful = require('..')
let Poll = require('./poll')

let PollRegistry = Trustful.registries['Poll']
let PollManager = Trustful.managers['Poll']

module.exports = class Polls {

  static create(poll){
    return new Promise((resolve, reject) => {
      PollManager.create.sendTransaction(
        Ethereum.utils.encode('string', poll.topic),
        Ethereum.utils.encode('string', poll.firstChoice),
        Ethereum.utils.encode('string', poll.secondChoice),
        Ethereum.transactionOptions(),
        (err, tx) => {
          if (err) return reject(err)
          return resolve(tx)
        }
      )
    })
  }

  static find(id){
    return new Promise((resolve, reject) => {
      PollRegistry.getPollContract.call(
        Ethereum.utils.encode('number', id),
        (err, address) => {
          if (err) return reject(err)
          if (Ethereum.utils.isZeroAddress(address)) return reject(`Poll not found by ID: ${id}`)
          return resolve(new Poll(id, address))
        }
      )
    })
  }

  static numPolls(){
    return new Promise((resolve, reject) => {
      PollRegistry.pollCounter.call(
        (err, num) => {
          if (err) return reject(err)
          return resolve(num)
        }
      )
    })
  }

  static findAll(){
    return this.numPolls().then(num => {

      let keys = _.range(1, Number(num)+1, 1)

      return Promise.all(_.map(keys, key => {
        return this.find(key)
      }))

    }).catch(error => reject(error))
  }
}
