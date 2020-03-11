const Migrations = artifacts.require('Migrations')
const JVC = artifacts.require('JVC')
const MGC = artifacts.require('MGC')
const Exchange = artifacts.require('Exchange')

module.exports = function(deployer) {
  deployer.deploy(Migrations)
  deployer
    .deploy(JVC)
    .then(() => deployer.deploy(MGC))
    .then(() => deployer.deploy(Exchange, JVC.address, MGC.address, 1))
}
