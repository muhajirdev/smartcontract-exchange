const Migrations = artifacts.require('Migrations')
const JVC = artifacts.require('JVC')
const MGC = artifacts.require('MGC')
const Exchange = artifacts.require('Exchange')

module.exports = function(deployer) {
  deployer.deploy(Migrations)
  deployer
    .deploy(JVC)
    .then(() => deployer.deploy(MGC))
    .then(() => deployer.deploy(Exchange, "0xaeA5E3D8Bf67D6d669f0317e74884cD2D87e6fC4", MGC.address, 1))
}
