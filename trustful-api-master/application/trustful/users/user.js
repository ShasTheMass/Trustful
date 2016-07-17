'use strict'

let _ = require('lodash')

let Ethereum = require('../../ethereum')
let Trustful = require('..')

module.exports = class User {

  constructor(id, address){
    this.id = id
    this.contract = Trustful.contracts['User'].at(address)
  }

  get details(){
  	return new Promise((resolve, reject) => {
  		this.contract.details((err, result) => {
			if (err) return reject(err)
			return resolve({
	  			id: this.id,
				name: Ethereum.utils.decode('string', result[0]),
				email: Ethereum.utils.decode('string', result[1]),
				password: Ethereum.utils.decode('string', result[2]),
	  			contract: {
	  				address: this.contract.address
	  			}
			})
  		})
  	})
  }
}
