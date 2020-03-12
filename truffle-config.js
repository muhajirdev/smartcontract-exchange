const HDWalletProvider = require('@truffle/hdwallet-provider')
require('babel-register')
require('babel-polyfill')

module.exports = {
  compilers: {
    solc: {
      version: '^0.4.24'
    }
  },
  mocha: {
    enableTimeouts: false
  },
  networks: {
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          ['ED3F00F64E7614E9A0C32A81839C8F62C07620E3BC11105AFC47AF2591CAB887', 'F8474CD41EDD4D292932A939840E34BE071E0C224C6B9D6C0E7F7220C3961307'],
          'https://ropsten.infura.io/v3/d463e7b3e22a4034a01e3f393f24e33e'
        ),
      network_id: 3
    }
  }
}
