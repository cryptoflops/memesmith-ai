// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./MemeCoin.sol";
import "./MemeBondingCurve.sol";

/// @title MemeCoinFactory
/// @notice Launchpad contract for creating MemeCoin + BondingCurve pairs
contract MemeCoinFactory is Ownable {
    struct MemeInfo {
        address token;
        address curve;
        address creator;
        string name;
        string symbol;
        uint256 initialSupply;   // whole tokens
        uint256 curveSupply;     // whole tokens
    }

    /// @notice flat fee in wei for launching a new meme
    uint256 public deployFee;

    MemeInfo[] public memes;

    event MemeLaunched(
        uint256 indexed id,
        address indexed creator,
        address token,
        address curve,
        string name,
        string symbol,
        uint256 initialSupply,
        uint256 curveSupply
    );

    // 👇 IMPORTANT: pass initial owner to Ownable
    constructor(uint256 deployFee_) Ownable(msg.sender) {
        deployFee = deployFee_;
    }

    function setDeployFee(uint256 newFee) external onlyOwner {
        deployFee = newFee;
    }

    function memesCount() external view returns (uint256) {
        return memes.length;
    }

    function createMemeWithCurve(
        string calldata name_,
        string calldata symbol_,
        uint256 initialSupply_,
        uint256 curveSupply_,
        uint256 basePrice_,
        uint256 pricePerToken_
    ) external payable returns (uint256 id, address token, address curve) {
        require(bytes(name_).length > 0, "name empty");
        require(bytes(symbol_).length > 0, "symbol empty");
        require(initialSupply_ > 0, "supply = 0");
        require(curveSupply_ > 0 && curveSupply_ <= initialSupply_, "bad curveSupply");

        require(msg.value >= deployFee, "fee not paid");

        MemeCoin meme = new MemeCoin(
            name_,
            symbol_,
            initialSupply_,
            address(this)
        );

        MemeBondingCurve bonding = new MemeBondingCurve(
            IERC20(address(meme)),
            basePrice_,
            pricePerToken_,
            msg.sender
        );

        uint256 curveAmount = curveSupply_ * 10 ** 18;
        require(
            meme.transfer(address(bonding), curveAmount),
            "curve transfer failed"
        );

        uint256 creatorAmount = (initialSupply_ - curveSupply_) * 10 ** 18;
        if (creatorAmount > 0) {
            require(
                meme.transfer(msg.sender, creatorAmount),
                "creator transfer failed"
            );
        }

        MemeInfo memory info = MemeInfo({
            token: address(meme),
            curve: address(bonding),
            creator: msg.sender,
            name: name_,
            symbol: symbol_,
            initialSupply: initialSupply_,
            curveSupply: curveSupply_
        });

        memes.push(info);
        id = memes.length - 1;

        emit MemeLaunched(
            id,
            msg.sender,
            address(meme),
            address(bonding),
            name_,
            symbol_,
            initialSupply_,
            curveSupply_
        );

        return (id, address(meme), address(bonding));
    }

    function withdrawFees(address payable to) external onlyOwner {
        require(to != address(0), "zero address");
        to.transfer(address(this).balance);
    }
}
