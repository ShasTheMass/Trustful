'use strict'

let restify = require('restify')
let Respectify = require('respectify')

let Ethereum = require('./ethereum')
let Trustful = require('./trustful')
 
let formatters = {
	'application/json': (req, res, body, callback) => {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
		res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
		res.setHeader('Access-Control-Allow-Credentials', true)
		try {
			return callback(null, JSON.stringify(body))
		} catch(e) {
			return callback(null, "{}")
		}
	}
}

let server = restify.createServer({
  name: 'Trustful API',
  version: '1.0.0',
  formatters: formatters
})

let respect = new Respectify(server)

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(respect.middleware())

server.use(restify.CORS({
	headers: ['X-Trustful']
}))

let config = {
	web3: {
		host: 'http://127.0.0.1',
		port: '8545'
	}
}

Ethereum.init(config)
	.then(() => Trustful.init())
	.then(() => {

		require('./api')(server)
		require('./api/setup')(server)
		require('./api/setup/load')(server)

		// Users
		require('./api/users/sign_up')(server)
		require('./api/users/sign_in')(server)
		require('./api/users/get_by_id')(server)

		// Polls
		require('./api/polls/create')(server)
		require('./api/polls/get_all')(server)
		require('./api/polls/get_by_id')(server)
		require('./api/polls/get_results')(server)
		require('./api/polls/cast_vote')(server)

		server.listen(8080, () => {
			console.log('%s listening at %s', server.name, server.url)
		})

	}).catch(err => {
		console.log(err)
	})


