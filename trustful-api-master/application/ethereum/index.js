'use strict'

let _ = require('lodash')
let solc = require('solc')

let WebThree = require('./webthree')
let Utils = require('./utils')

module.exports = new function(){

  this.transactionOptions = function(){
    return {
      from: this.web3.eth.coinbase,
      gas: 90000000,
      gasPrice: 50000000000000
    }
  }

  this.init = options => {
    return new Promise((resolve, reject) => {
      return WebThree.init(options.web3).then(web3 => {
        this.web3 = web3
        this.utils = new Utils(web3)
        if (options.web3.path) return resolve(`Connected to JSON IPC at: ${options.web3.path}`)
        else return resolve(`Connected to JSON RPC at: ${options.web3.host}:${options.web3.port}`)
      }).catch(err => reject(err))
    })
  }

  this.compileSolidity = input => {
    return new Promise((resolve, reject) => {
      let output = solc.compile({sources: input}, 1)
      if (output.errors) return reject(output.errors)

      let contracts = {}

      _.forEach(output.contracts, function(compiled, name){
        contracts[name] = {
          abi: JSON.parse(compiled.interface),
          bytecode: compiled.bytecode
        }
      })

      return resolve(contracts)
    })
  }
}
