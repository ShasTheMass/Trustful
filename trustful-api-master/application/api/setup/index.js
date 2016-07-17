'use strict'

let _ = require('lodash')

let TrustfulDeployer = require('../../deployer')

module.exports = server => {

  server.get(endpoint, (req, res, next) => {

  	TrustfulDeployer.deployContract('Trustful')
  		.then(trustfulAddress => TrustfulDeployer.setTrustfulAddress(trustfulAddress))
  		.then(trustfulAddress => {
  			return Promise.all(_.map(TrustfulDeployer.contractNames(), contractName => {
  				return TrustfulDeployer.deployContract(contractName)
  					.then(contractAddress => TrustfulDeployer.addTrustfulContract(contractName, contractAddress))
  			}))
      }).then(result => {
        res.send({
          data: {
            message: 'Trustful setup completed'
          }
        })
  		}).catch(err => {
        res.send({
          data: {
            message: err
          }
        })
	  	})
  }) 
}

let endpoint = {
  path: '/setup',
  version: '1.0.0',
  params: {}
}
