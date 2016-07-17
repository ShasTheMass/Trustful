'use strict'

let Ethereum = require('../../ethereum')

module.exports = class ContractProvider {

  static at(address){
    return Ethereum.web3.eth.contract([
      {
        "constant": false,
        "inputs": [
          {
            "name": "name",
            "type": "bytes32"
          }
        ],
        "name": "contracts",
        "outputs": [
          {
            "name": "addr",
            "type": "address"
          }
        ],
        "type": "function"
      }
    ]).at(address)
  }

}
