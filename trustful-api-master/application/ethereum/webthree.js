'use strict'

let net = require('net')
let Web3 = require('web3')

module.exports = new function(){

  this.init = options => {
    return new Promise((resolve, reject) => {
      this.provider = new Web3.providers.HttpProvider(`${options.host}:${options.port}`)
      this.web3 = new Web3(this.provider)
      if (this.web3.isConnected()) return resolve(this.web3)
      return reject(`Can't connect to JSON RPC at: ${options.host}:${options.port}`)
    })
  }
}
