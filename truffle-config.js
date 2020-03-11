require('babel-register')
require('babel-polyfill')

module.exports = {
  compilers: {
    solc: {
      version: '^0.4.24'
    }
  }
}
