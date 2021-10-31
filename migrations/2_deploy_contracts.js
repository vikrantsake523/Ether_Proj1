const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts){
  //accounts are the array accounts of ganache 

  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()
  
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address) 
  const tokenFarm = await TokenFarm.deployed()
  
  //transfer all tokens from dapp to tokenfarm - 1 million tokens - 1million * 10^18 
  // 1 token = 10** 18
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')
  
  //transfer 100 Mock DAI tokens to investor. index 0 is deployer, index 1 is investor
  await daiToken.transfer(accounts[1], '100000000000000000000')
}

