const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Setting fee with account:", deployer.address);

    // Factory address on Arbitrum
    const factoryAddress = "0xB5D511dD402DA6428419633e883fda21c9F8aD67";

    // Get the contract instance
    const Factory = await hre.ethers.getContractFactory("MemeCoinFactory");
    const factory = Factory.attach(factoryAddress);

    // Set fee to 0
    const newFee = hre.ethers.parseEther("0");

    console.log("Setting deploy fee to 0...");
    const tx = await factory.setDeployFee(newFee);
    await tx.wait();

    console.log("Fee updated successfully!");
    console.log("Transaction hash:", tx.hash);

    // Verify the new fee
    const currentFee = await factory.deployFee();
    console.log("Current fee:", hre.ethers.formatEther(currentFee), "ETH");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
