'use strict'

let _ = require('lodash')
let path = require('path')
let jsonfile = require('jsonfile')

let Ethereum = require('../ethereum')
let ContractProvider = require('./utils/contract_provider')

module.exports = class Trustful {

  static init(){
    return readConfig().then(config => {
      this.contracts = _.mapValues(config.contracts, contract => Ethereum.web3.eth.contract(contract.abi))
      this.instance = this.contracts['Trustful'].at(config.trustful.address)

      // Contract names
      let contractNames = Object.keys(this.contracts)
      let registries = _.filter(contractNames, contractName => _.endsWith(contractName, 'Registry'))
      let managers = _.filter(contractNames, contractName => _.endsWith(contractName, 'Manager'))

      // Manager contracts
      this.registries = {}
      this.managers = {}

      let calls = []
      let errors = ''

      // Load registries
      _.forEach(registries, registry => {
        calls.push(getTrustfulContractAddress(this.instance.address, registry).then(address => {
          let contract = this.contracts[registry]
          let name = registry.substring(0, registry.indexOf('Registry'))
          if (address){
            this.registries[name] = contract.at(address)
          } else {
            errors += `\n${registry} address not set`
          }
        }))
      })

      // Load managers
      _.forEach(managers, manager => {
        calls.push(getTrustfulContractAddress(this.instance.address, manager).then(address => {
          let contract = this.contracts[manager]
          let name = manager.substring(0, manager.indexOf('Manager'))
          if (address){
            this.managers[name] = contract.at(address)
          } else {
            errors += `\n${manager} address not set`
          }
        }))
      })

      if (errors.length) return reject(new Error(errors))
      return Promise.all(calls)
    })
  }
}

function getTrustfulContractAddress(mainContractAddress, contractName){
	return new Promise((resolve, reject) => {
		ContractProvider.at(mainContractAddress).contracts.call(
			contractName,
			Ethereum.transactionOptions(),
			(err, address) => {
				if (err) return reject(`Can't retrieve ${contractName} contract address`)
				return resolve(address)
			}
		)
	})
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
