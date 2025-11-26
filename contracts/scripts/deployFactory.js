const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "CELO");

  // The flat fee for launching a new meme (0.5 CELO)
  const deployFee = hre.ethers.parseEther("0.5");

  // Deploy the factory
  const Factory = await hre.ethers.getContractFactory("MemeCoinFactory");
  const factory = await Factory.deploy(deployFee);

  await factory.waitForDeployment();

  console.log("✅ MemeCoinFactory deployed at:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

