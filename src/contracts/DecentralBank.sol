pragma solidity ^0.5.0;

import "./Reward.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentralised Bank";
    address public owner;
    Tether public tether;
    Reward public reward;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(Reward _reward, Tether _tether) public {
        reward = _reward;
        tether = _tether;
    }

    //staking function
    function depositTokens(uint256 _amount) public {
        //transfer tether tokens to this contract address forstaking
        require(_amount > 0, "amount cannot be 0");
        tether.transferFrom(msg.sender, address(this), _amount);
        //update staking balance
        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
}
