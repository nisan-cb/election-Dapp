// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// OpenZeppelin package contains implementation of the ERC 20 standard, which our NFT smart contract will inherit
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VotingToken is ERC20 {
    address payable public owner;

    constructor(uint256 initialSupply) ERC20("VotingToken", "VOTE") {
        owner = payable(msg.sender);
        _mint(owner, initialSupply * (10 ** 18));
    }

    function mint(address recipient, uint256 amount) public {
        // require(msg.sender == owner, "Only owner can mint tokens");
        _mint(payable(recipient), amount * (10 ** 18));
    }
}
