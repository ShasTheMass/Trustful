'use strict'

let _ = require('lodash')

let Ethereum = require('../../ethereum')
let Trustful = require('..')
let User = require('./user')

let UserRegistry = Trustful.registries['User']
let UserManager = Trustful.managers['User']

module.exports = class Users {

  static create(user){
    return new Promise((resolve, reject) => {
      UserManager.create.sendTransaction(
        Ethereum.utils.encode('string', user.name),
        Ethereum.utils.encode('string', user.email),
        Ethereum.utils.encode('string', user.password),
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
      UserRegistry.getUserContract.call(
        Ethereum.utils.encode('number', id),
        (err, address) => {
          if (err) return reject(err)
          if (Ethereum.utils.isZeroAddress(address)) return reject(`User not found by ID: ${id}`)
          return resolve(new User(id, address))
        }
      )
    })
  }
}
