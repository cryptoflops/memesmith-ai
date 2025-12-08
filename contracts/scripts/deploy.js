const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("Deploying with account:", deployer.address);
  const networkName = hre.network.name;
  const symbol = (networkName === "celo" || networkName === "celoSepolia") ? "CELO" : "ETH";
  console.log("Balance:", hre.ethers.formatEther(balance), symbol);

  // Deploy Factory with 0 fee initially
  // You can set the user-facing token deployment fee later using setDeployFee()
  const deployFee = hre.ethers.parseEther("0");
  console.log("Deploying MemeCoinFactory with initial fee: 0");

  const Factory = await hre.ethers.getContractFactory("MemeCoinFactory");
  const factory = await Factory.deploy(deployFee);

  await factory.waitForDeployment();
  console.log("MemeCoinFactory deployed to:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
