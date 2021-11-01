pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    // All code goes here...
    string public name = "Dapp Token Farm";

    DappToken public dappToken;
    DaiToken public daiToken;
    address owner;

    mapping(address =>uint) public stakingBalance;
    mapping(address =>bool) public hasStaked;
    mapping(address =>bool) public isStaking;
    address[] public stakers;


    constructor (DappToken _dappToken, DaiToken _daiToken) public {
        dappToken =  _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }


    //1. staking tokens
    function stakeTokens(uint _amount) public {
        //require that amount is greater than 0
        require(_amount > 0, "Amount cannot be 0");

        //putting mock dai tokens from sender to the current smartcontract address
        daiToken.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] += _amount;

        //add users to array only if they are not added
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    //2. Issuing same amount of dappTokens to the investors
    function issueTokens() public {
        require(msg.sender == owner, "Owner must be sender"); 
        for(uint i=0;i<stakers.length;i++){
            uint256 balance = stakingBalance[stakers[i]];
            if(balance > 0){
                dappToken.transfer(stakers[i],balance);
            }
        }
    }

    //3. to remove/ unstake tokens
    function unstakeTokens() public {
        //fetch stake balance
        uint bal = stakingBalance[msg.sender];
        require(bal > 0,"Amount should be more than 0");

        daiToken.transfer(msg.sender, bal);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender]  = false;
    }
}
