const JVC = artifacts.require('JVC')
const MGC = artifacts.require('MGC')
const Exchange = artifacts.require('Exchange')

const MONAD_COIN_ADDRESS = '0xaeA5E3D8Bf67D6d669f0317e74884cD2D87e6fC4'

contract('Exchange', async function(accounts) {
  it('admin can transfer mgc to exchange', async () => {
    const mgc = await MGC.deployed()
    const exchange = await Exchange.deployed()

    const admin = (await web3.eth.getAccounts())[0]

    await mgc.transfer(exchange.address, 1000)
    const admin_cub_balance = await mgc.balanceOf(admin)
    const exchange_cub_balance = await mgc.balanceOf(exchange.address)

    assert.equal(100000000000 - 1000, admin_cub_balance)
    assert.equal(1000, exchange_cub_balance)
  })

  it('user can transfer jvp to get mgc', async () => {
    const jvc = await JVC.at(MONAD_COIN_ADDRESS)
    const mgc = await MGC.deployed()
    const exchange = await Exchange.deployed(jvc.address, mgc.address, 1)

    const user = (await web3.eth.getAccounts())[1]

    // set initial 10k mgc coin for exchange
    await mgc.transfer(exchange.address, 100000)
    const exchange_initial_mgc_balance = await mgc.balanceOf(exchange.address)
    assert(exchange_initial_mgc_balance, 100000)

    // user give exchange 3000 allowance;
    jvc.approve(exchange.address, 3000, { from: user })

    // user buy 2000 MGC with JVC
    const user_jvc_balance_before_buying_MGC = await jvc.balanceOf(user)
    const user_mgc_balance_before_buying_MGC = await mgc.balanceOf(user)
    await exchange.buyMGCWithJVC(2000, { from: user })
    const user_jvc_balance_after_buying_MGC = await jvc.balanceOf(user)
    const user_mgc_balance_after_buying_MGC = await mgc.balanceOf(user)

    expect(user_jvc_balance_after_buying_MGC).to.not.equal(user_jvc_balance_before_buying_MGC)
    expect(user_mgc_balance_after_buying_MGC).to.not.equal(user_mgc_balance_before_buying_MGC)
  })
})

contract('Exchange End Sale', async accounts => {
  it('admin can end sale', async () => {
    const exchange = await Exchange.deployed()
    const mgc = await MGC.deployed()

    const admin = (await web3.eth.getAccounts())[0]

    // Check admin initial balance
    const admin_balance = await mgc.balanceOf(admin)
    assert.equal(admin_balance, 100000000000, 'initial balance is not correct')

    // Transfer to exchange
    await mgc.transfer(exchange.address, 1000, { from: admin })

    await exchange.endSale({ from: admin })

    // Check admin balance after endSale
    const admin_balance_after_sale = await mgc.balanceOf(admin)
    assert.equal(admin_balance_after_sale, 100000000000)
  })
})
