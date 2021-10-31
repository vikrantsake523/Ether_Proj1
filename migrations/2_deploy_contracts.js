const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts){
  //accounts are the array accounts of ganache 

  await deployer.deploy(DaiToken)
  const daiToken = DaiToken.deployed()

  await deployer.deploy(DappToken)
  const dappToken = DappToken.deployed()
  
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = TokenFarm.deployed()
  
}