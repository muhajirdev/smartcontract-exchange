const Migrations = artifacts.require('Migrations')
const JVC = artifacts.require('JVC')
const MGC = artifacts.require('MGC')
const Exchange = artifacts.require('Exchange')

const isTesnet = process.env.NETWORK === 'ropsten'
const MONAD_COIN_ADDRESS = '0xaeA5E3D8Bf67D6d669f0317e74884cD2D87e6fC4'

module.exports = function(deployer) {
  deployer.deploy(Migrations)
  deployer
    .deploy(JVC)
    .then(() => deployer.deploy(MGC))
    .then(() => deployer.deploy(Exchange, isTesnet ? MONAD_COIN_ADDRESS : JVC.address, MGC.address, 1))
}
