// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemeBondingCurve is Ownable {
    IERC20 public token;
    uint256 public basePrice;
    uint256 public pricePerToken;
    uint256 public sold;

    constructor(
        IERC20 token_,
        uint256 basePrice_,
        uint256 pricePerToken_,
        address owner_
    ) Ownable(owner_) {
        token = token_;
        basePrice = basePrice_;
        pricePerToken = pricePerToken_;
    }

    function buy(uint256 amount) external payable {
        uint256 total = basePrice * amount + (pricePerToken * sold * amount);
        require(msg.value >= total, "Not enough CELO");
        token.transfer(msg.sender, amount * 1e18);
        sold += amount;
        payable(owner()).transfer(msg.value);
    }
}
