const { assert } = require('chai')
//const { Item } = require('react-bootstrap/lib/Breadcrumb')

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('TokenFarm', (accounts) => {
    let daiToken

    //writing a before hook
    before( async () => {
        daiToken = await DaiToken.new()
    })

    //tests come here
    describe('Mock Dai Deployment', async() => {
        it('has a name', async() => {
            const name = await daiToken.name()
            assert.equal(name,'Mock DAI Token') 
        })
    })
})
