const CryptoStar = artifacts.require('CryptoStar')
const BigNumber = require('bignumber.js')

contract('CryptoStar', (accs) => {
    let accounts = accs;
    let instance;

  beforeEach('get contract instance', async () => {
	instance = await CryptoStar.deployed();
  });

  it('can Claim a CryptoStar', async() => {
    let tokenId = 1;
    await instance.claimStar('star #1', tokenId, {from: accounts[0]})
    assert.equal((await instance.tokenIdToStarInfo.call(tokenId)).name, 'star #1')
  });

  it('can Put a CryptoStar Up For Sale', async() => {
    let user1 = accounts[1]
    let starId = 2;
    let starPrice = web3.utils.toWei('.01', "ether")
    await instance.claimStar('star #2', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    assert.equal(await instance.starsForSale.call(starId), starPrice)
  });

  it('lets Seller Get the Funds After the Sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 3
    let starPrice = web3.utils.toWei('.01', "ether")
    await instance.claimStar('star #3', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    const balanceOfUser1BeforeTransaction = new BigNumber(await web3.eth.getBalance(user1))
    await instance.buyStar(starId, {from: user2, value: starPrice})
    const balanceOfUser1AfterTransaction = new BigNumber(await web3.eth.getBalance(user1))
    assert.equal(balanceOfUser1BeforeTransaction.plus(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber());
  });

  it('can Buy a CryptoStar, if it is For Sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 4
    let starPrice = web3.utils.toWei('.01', "ether")
    await instance.claimStar('star #4', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    await instance.buyStar(starId, {from: user2, value: starPrice});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });

  it('Buyer\'s ether balance decreases by CryptoStar price', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 5
    let starPrice = web3.utils.toWei('.01', "ether")
    await instance.claimStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    const balanceOfUser2BeforeTransaction = new BigNumber(await web3.eth.getBalance(user2))
    await instance.buyStar(starId, {from: user2, value: starPrice, gasPrice:0})
    const balanceAfterUser2BuysStar = new BigNumber(await web3.eth.getBalance(user2))
    assert.equal(balanceOfUser2BeforeTransaction.minus(balanceAfterUser2BuysStar), starPrice);
  });

  // 1) The token name and token symbol are added properly.

  it('can get CryptoStar token name', async () => {
    assert.equal('CryptoStar', await instance.name.call());
  });

  it('can get CryptoStar token symbol', async () => {
    assert.equal('CST', await instance.symbol.call());
  });

  // 2) The token can be looked up.

  it('can lookup a CryptoStar using the tokenId', async() => {
    let tokenId = 6;
    await instance.claimStar('star #6', tokenId, {from: accounts[0]})
    let starName = await instance.lookUptokenIdToStarInfo(tokenId);
    assert.equal(starName, 'star #6')
  });

  // 3) 2 users can exchange their crypto stars.

  // 4) CryptoStar tokens can be transferred from one address to another.


});
