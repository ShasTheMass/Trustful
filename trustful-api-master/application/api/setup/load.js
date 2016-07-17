'use strict'

let TrustfulDeployer = require('../../deployer')

module.exports = server => {
  server.get(endpoint, (req, res, next) => {
  	TrustfulDeployer.loadContracts().then(message => {
	    res.send({
	      status: 200,
	      message: 'All contracts loaded successfully'
	    })
	  }).catch(err => res.send(err))
  }) 
}

let endpoint = {
  path: '/setup/load',
  version: '1.0.0',
  params: {}
}
