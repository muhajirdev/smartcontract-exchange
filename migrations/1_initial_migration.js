const Migrations = artifacts.require('Migrations')
const BearToken = artifacts.require('BearToken')
const CubToken = artifacts.require('CubToken')
const Exchange = artifacts.require('Exchange')

module.exports = function(deployer) {
  deployer.deploy(Migrations)
  deployer
    .deploy(BearToken)
    .then(() => deployer.deploy(CubToken))
    .then(() => deployer.deploy(Exchange, BearToken.address, CubToken.address, 1))
}
