const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("Deploying with account:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "CELO");

  const Token = await hre.ethers.getContractFactory("MemeToken");
  const token = await Token.deploy(
    "MemeSmithToken",                   // name
    "MEME",                             // symbol
    hre.ethers.parseUnits("1000000", 18), // 1,000,000 supply
    deployer.address                    // owner
  );

  await token.waitForDeployment();
  console.log("Token deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
