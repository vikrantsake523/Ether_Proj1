import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'
import Main from './Main'

import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'

class App extends Component {

  
  // this is a react component
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  //load stuff from blockc and put it in a state
  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    // console.log(accounts)

    // this will update 0x0 account with our metamask account
    this.setState({ account: accounts[0]})

    //get netwk id : 5777
    const networkId = await web3.eth.net.getId()

    //load dai token from abi
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData){

      //var contract = new Contract(jsonInterface, address);
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken})

      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({daiTokenBalance: daiTokenBalance.toString()})
    }
    else{
      window.alert('DaiToken contract not deployed to detected network')
    }
    
    
    //load dapptoken data from abi
    const dappTokenData = DappToken.networks[networkId]
    if(dappTokenData){
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
      this.setState({ dappToken})

      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
      this.setState({dappTokenBalance: dappTokenBalance.toString()})
    }
    else{
      window.alert('DappToken contract not deployed to detected network')
    }

    //load tokenfarm data from abi
    const tokenFarmData = TokenFarm.networks[networkId]
    if(tokenFarmData){
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({ tokenFarmData })

      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({stakingBalance: stakingBalance.toString()})
    }
    else{
      window.alert('TokenFarm contract not deployed to detected network')
    }

    // this is for website loading
    this.setState({loading: false})
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()  
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading){
      content = <p id="loader" className = "text-center">Loading....!</p>
    }
    else{
      content = <Main
        daiTokenBalance = {this.state.daiTokenBalance}
        dappTokenBalance = {this.state.dappTokenBalance}
        stakingBalance = {this.state.stakingBalance}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
