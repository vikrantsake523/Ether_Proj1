const { assert } = require('chai')
const web3 = require('web3')
//const { Item } = require('react-bootstrap/lib/Breadcrumb')

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n){
    // return web3.utils.toWei(n,'Ether')
    return web3.utils.toWei(n,'Ether')
}

// contract('TokenFarm', (accounts) => {
contract('TokenFarm', ([owner,investor]) => {
    let daiToken, dappToken, tokenFarm

    //writing a before hook
    before( async () => {
        //deploy contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        //transfer amount
        // await dappToken.transfer(tokenFarm.address,'1000000000000000000000000')
        // await dappToken.transfer(tokenFarm.address,web3.utils.toWei('1000000','Ether'))

        //better to create a function to do it 
        await dappToken.transfer(tokenFarm.address,tokens('1000000'))

        //send 
        // await daiToken.transfer(accounts[1],tokens('100'),{from: accounts[0]})
        await daiToken.transfer(investor,tokens('100'),{from: owner})
    })

    //tests come here
    describe('Mock Dai Deployment', async() => {
        it('has a name', async() => {
            const name = await daiToken.name()
            assert.equal(name,'Mock DAI Token') 
        })
    })

    describe('DApp Token Deployment', async() => {
        it('has a name', async() => {
            const name = await dappToken.name()
            assert.equal(name,'DApp Token') 
        })
    })

    describe('Token Farm Deployment', async() => {
        it('has a name', async() => {
            const name = await tokenFarm.name()
            assert.equal(name,'Dapp Token Farm') 
        })

        it('contract has tokens', async() => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(),tokens('1000000'))
        })
    })

    describe('Farming tokens', async() => {
        it('rewards investors for staking mDai tokens', async() => {
            let result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 
                    'Investor Mock DAI wallet bal correct before staking')

            await daiToken.approve(tokenFarm.address,tokens('100'), {from: investor})
            await tokenFarm.stakeTokens(tokens('100'), {from: investor})

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'),'investor Mock Dai balance after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'token farm Mock Dai balance after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status after staking')

            //issue dapp tokens from owner to investor
            await tokenFarm.issueTokens({from: owner})

            result = await dappToken.balanceOf(investor)
            assert.equal(result, tokens('100'), 'Checking dapptoken bal in investors account')

            //ensure that only owner can issue tokens
            await tokenFarm.issueTokens({from: investor}).should.be.rejected;

            //unstaking
            await tokenFarm.unstakeTokens({from: investor})

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'),'Returning daitokens to investor from tokenfarm')
            
            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'),'Balance of investor in tokenfarm is zero after unstaking')
            
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'),'investor staking bal after unstaking')
            
            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false' ,'investor staking bal after unstaking')
        })
    })

})
