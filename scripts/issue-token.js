//script for automating token issuement

const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(callback) {

    console.log("Tokens issued")

    let tokenFarm = await TokenFarm.deployed()
    await tokenFarm.issueTokens()
    
    callback()
}