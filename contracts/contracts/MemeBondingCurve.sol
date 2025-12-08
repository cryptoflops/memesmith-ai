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

    function getCost(uint256 currentSupply, uint256 amount) public view returns (uint256) {
        // Linear Curve: Price = basePrice + k * supply
        // Cost = Integral(basePrice + k * x) from current to current+amount
        // Cost = basePrice * amount + k * ( (current+amount)^2/2 - current^2/2 )
        // Cost = basePrice * amount + k * (amount * current + amount^2/2)
        
        // k = pricePerToken
        uint256 k = pricePerToken;
        
        uint256 term1 = basePrice * amount;
        uint256 term2 = k * (amount * currentSupply + (amount * amount) / 2);
        
        return term1 + term2;
    }

    function buy(uint256 amount) external payable {
        uint256 cost = getCost(sold, amount);
        require(msg.value >= cost, "Not enough CELO");
        
        token.transfer(msg.sender, amount * 1e18);
        sold += amount;
        
        (bool success, ) = payable(owner()).call{value: msg.value}("");
        require(success, "Transfer failed");
    }
}
