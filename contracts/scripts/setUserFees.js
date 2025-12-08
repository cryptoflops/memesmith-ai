const hre = require("hardhat");

// Factory addresses on each network
const FACTORY_ADDRESSES = {
    celo: "0xa45ca882C694e57D4Cc7eCf61C68b6d9dC5eB9dE",
    base: "0x379248e57299dAF605B1dF921bf4A0eD2eFE2F23",
    optimism: "0xa45ca882C694e57D4Cc7eCf61C68b6d9dC5eB9dE",
    arbitrum: "0xB5D511dD402DA6428419633e883fda21c9F8aD67",
};

// Fees for each network
const FEES = {
    celo: hre.ethers.parseEther("1"), // 1 CELO
    base: hre.ethers.parseEther("0.0001"), // 0.0001 ETH
    optimism: hre.ethers.parseEther("0.0001"), // 0.0001 ETH
    arbitrum: hre.ethers.parseEther("0.0001"), // 0.0001 ETH
};

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const networkName = hre.network.name;

    console.log("Setting user-facing deployment fee on", networkName);
    console.log("Account:", deployer.address);

    const factoryAddress = FACTORY_ADDRESSES[networkName];
    const newFee = FEES[networkName];

    if (!factoryAddress) {
        throw new Error(`No factory address configured for network: ${networkName}`);
    }

    if (!newFee) {
        throw new Error(`No fee configured for network: ${networkName}`);
    }

    // Get the contract instance
    const Factory = await hre.ethers.getContractFactory("MemeCoinFactory");
    const factory = Factory.attach(factoryAddress);

    console.log("Factory address:", factoryAddress);
    console.log("New fee:", hre.ethers.formatEther(newFee), networkName === "celo" ? "CELO" : "ETH");

    // Set the fee
    const tx = await factory.setDeployFee(newFee);
    console.log("Transaction sent:", tx.hash);

    await tx.wait();
    console.log("✅ Fee updated successfully!");

    // Verify the new fee
    const currentFee = await factory.deployFee();
    console.log("Current fee:", hre.ethers.formatEther(currentFee), networkName === "celo" ? "CELO" : "ETH");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
