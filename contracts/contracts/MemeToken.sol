// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemeToken is ERC20, Ownable {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        address ownerAddr
    )
        ERC20(name_, symbol_)
        Ownable(ownerAddr) // ✅ pass the owner to the new Ownable constructor
    {
        _mint(ownerAddr, initialSupply);
    }
}
