'use strict'

let _ = require('lodash')

module.exports = function(web3){

  this.encode = function(type, value){
    switch (type){
      case 'string':
        return this.encodeString(value)
      case 'number':
        return this.encodeNumber(value)
      default:
        return value
    }
  }

  this.decode = function(type, value){
    switch (type){
      case 'string':
        return this.decodeString(value)
      case 'number':
        return this.decodeNumber(value)
      default:
        return value
    }
  }

  this.encodeString = function(value){
    value = value ? String(value) : ''
    return this.fromAscii(value, 32)
  }

  this.decodeString = function(value){
    if (!value) return null
    if (!Number(value)) return null
    let decoded = web3.toAscii(value)
    decoded = decoded.replace(/[\u0000]+$/g, '')
    if (!decoded) return null
    return decoded
  }

  this.encodeNumber = function(value){
    return Number(value)
  }

  this.decodeNumber = function(value){
    return Number(value)
  }

  this.fromAscii = function(str, pad){
    if (!str || str == undefined || str == null) str = ''
    pad = pad === undefined ? 0 : pad
    let hex = this.toHexNative(str)
    while (hex.length < pad * 2) hex += '00'
    return '0x' + hex
  }

  this.toHexNative = function(str){
    let hex = ''
    for (let i = 0; i < str.length; i++) {
      let n = str.charCodeAt(i).toString(16)
      hex += n.length < 2 ? '0' + n : n
    }
    return hex
  }

  this.isAddress = function(address){

      // Check if it has the basic requirements of an address
      if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false

      // If it's all small caps or all all caps, return true
      else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) return true
          
      // Otherwise check each case
      else return isChecksumAddress(address)
  }

  this.isChecksumAddress = function(address){

      // Check each case
      address = address.replace('0x','')
      let addressHash = sha3(address.toLowerCase())

      for (let i=0; i<40; i++){

          // The nth letter should be uppercase if the nth digit of casemap is 1
          if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || 
             (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])){
              return false;
          }
      }

      return true
  }

  this.isZeroAddress = function(address){
    return address == 0 || address == '0x'
  }
}
