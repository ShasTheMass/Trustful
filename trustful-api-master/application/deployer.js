'use strict'

let _ = require('lodash')
let fs = require('fs')
let jsonfile = require('jsonfile')
let solc = require('solc')

let Ethereum = require('./ethereum')

let sources = [
  'framework/owned',
  'framework/trustful_contract',
  'framework/trustful_entity',
  'framework/trustful',
  'framework/contract_provider',
  'users/user',
  'users/user_registry',
  'users/user_manager',
  'polls/poll',
  'polls/poll_registry',
  'polls/poll_manager'
]

let contracts = [
  'UserRegistry',
  'UserManager',
  'PollRegistry',
  'PollManager'
]

module.exports = class TrustfulDeployer {

  static contractNames(){
    return contracts
  }

  static loadContracts(){
    return new Promise((resolve, reject) => {
      let input = {}
      _.forEach(sources, source => {
        let path = `contracts/${source}.sol`
        input[`${source}.sol`] = fs.readFileSync(path, 'utf8')
      })
      Ethereum.compileSolidity(input).then(compiled => {
        readConfig().then(config => {
          config.contracts = compiled
          jsonfile.writeFile('config.json', config, {spaces: 2}, err => {
            if (err) return reject(err)
            return resolve(`Updated config.json`)
          })
        }).catch(err => reject(err))
      }).catch(err => reject(err))
    })
  }

  static deployContract(name){
    return new Promise((resolve, reject) => {
      readConfig().then(config => {
        let compiled = config.contracts[name]
        if (!compiled) return reject(new Error(`Contract ${name} is not loaded`))
        let contract = Ethereum.web3.eth.contract(compiled.abi)
        let options = {
          from: Ethereum.web3.eth.coinbase,
          data: compiled.bytecode,
          gas: 90000000
        }
        contract.new(options, (err, deployed) => {
          if (err) return reject(err)
          if (deployed && deployed.address && typeof deployed.address != 'undefined'){
            console.log(`${name} contract deployed at: ${deployed.address}`)
            return resolve(deployed.address)
          }
        })
      }).catch(err => reject(err))
    })
  }

  static setTrustfulAddress(address){
    return new Promise((resolve, reject) => {
      readConfig().then(config => {
        config.trustful = config.trustful || {}
        config.trustful.address = address
        jsonfile.writeFile('config.json', config, {spaces: 2}, err => {
          if (err) return reject(err)
          return resolve(address)
        })
      }).catch(err => reject(err))
    })
  }

  static addTrustfulContract(name, address){
    return new Promise((resolve, reject) => {
      readConfig().then(config => {
        if (!config.trustful.address) return reject(new Error('Trustful address is not specified'))
        let abi = config.contracts['Trustful'].abi
        let contract = Ethereum.web3.eth.contract(abi)
        let TrustfulContract = contract.at(config.trustful.address)
        TrustfulContract.addContract.sendTransaction(
          name,
          address,
          Ethereum.transactionOptions(),
          (err, txId) => {
            if (err) return reject(err)
            return resolve({
              contract: {
                name: name,
                address: address
              },
              transaction: {
                id: txId
              }
            })
          }
        )
      }).catch(err => reject(err))
    })
  }

}

function readConfig(){
  return new Promise((resolve, reject) => {
    jsonfile.readFile('config.json', (err, config) => {
      if (err) config = {
        trustful: {},
        contracts: {}
      }
      return resolve(config)
    })
  })
}
