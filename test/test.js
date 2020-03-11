const Bear = artifacts.require('BearToken')
const Cub = artifacts.require('CubToken')
const Exchange = artifacts.require('Exchange')

contract('Exchange', async function(accounts) {
  it('admin can transfer mgc to exchange', async () => {
    const mgc = await Cub.deployed()
    const exchange = await Exchange.deployed()

    const admin = (await web3.eth.getAccounts())[0]
    const user = (await web3.eth.getAccounts())[1]

    await mgc.transfer(exchange.address, 1000)
    const admin_cub_balance = await mgc.balanceOf(admin)
    const exchange_cub_balance = await mgc.balanceOf(exchange.address)

    assert.equal(100000000000 - 1000, admin_cub_balance)
    assert.equal(1000, exchange_cub_balance)
  })

  it('user can transfer jvp to get mgc', async () => {
    const jvc = await Bear.deployed()
    const mgc = await Cub.deployed()
    const exchange = await Exchange.deployed(jvc.address, mgc.address, 1)

    const mgcinexchange = await exchange.MGCAddress()
    const jvcinexchange = await exchange.JVCAddress()
    const price = await exchange.MGCPrice()
    console.log(`
        mgcinexchange : ${mgcinexchange}
        jvcinexchange : ${jvcinexchange}
        mgc.address : ${mgc.address},
        jvc.address : ${jvc.address}
        exchange.address : ${exchange.address} 
        price:  ${price}
    `)

    assert.equal(mgcinexchange, mgc.address)
    assert.equal(jvcinexchange, jvc.address)

    const user = (await web3.eth.getAccounts())[1]

    // set initial jvc coin for user;
    await jvc.transfer(user, 5000)
    const user_initial_jvc_balance = await jvc.balanceOf(user)
    assert(user_initial_jvc_balance, 5000)

    // set initial 10k mgc coin for exchange
    await mgc.transfer(exchange.address, 100000)
    const exchange_initial_mgc_balance = await mgc.balanceOf(exchange.address)
    assert(exchange_initial_mgc_balance, 100000)

    // user give exchange 3000 allowance;
    jvc.approve(exchange.address, 3000, { from: user })

    // user buy 2000 MGC with JVC
    await exchange.buyMGCWithJVC(2000, { from: user })

    const user_jvc_balance_after_buying_MGC = await jvc.balanceOf(user)
    assert.equal(user_jvc_balance_after_buying_MGC, 3000)

    const user_mgc_balance_after_buying_MGC = await mgc.balanceOf(user)
    assert.equal(user_mgc_balance_after_buying_MGC, 2000)
  })
})
