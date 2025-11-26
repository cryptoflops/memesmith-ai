const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const networkName = hre.network.name;
    console.log(`\n🚀 Deploying MemeCoinFactory to ${networkName}...`);

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

    // The flat fee for launching a new meme (0.5 ETH/token equivalent)
    const deployFee = hre.ethers.parseEther("0.5");

    // Deploy the factory
    console.log("\n📦 Deploying MemeCoinFactory...");
    const Factory = await hre.ethers.getContractFactory("MemeCoinFactory");
    const factory = await Factory.deploy(deployFee);

    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();

    console.log("✅ MemeCoinFactory deployed at:", factoryAddress);

    // Save deployment info
    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentInfo = {
        network: networkName,
        chainId: hre.network.config.chainId,
        factoryAddress: factoryAddress,
        deployFee: hre.ethers.formatEther(deployFee),
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
    };

    const filePath = path.join(deploymentsDir, `${networkName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 Deployment info saved to: ${filePath}`);

    // Wait for block confirmations before verification
    console.log("\n⏳ Waiting for block confirmations...");
    await factory.deploymentTransaction().wait(5);

    // Verify contract if not on local network
    if (networkName !== "hardhat" && networkName !== "localhost") {
        console.log("\n🔍 Verifying contract on block explorer...");
        try {
            await hre.run("verify:verify", {
                address: factoryAddress,
                constructorArguments: [deployFee],
            });
            console.log("✅ Contract verified successfully!");
        } catch (error) {
            console.log("⚠️  Verification failed:", error.message);
            console.log("You can verify manually later with:");
            console.log(`npx hardhat verify --network ${networkName} ${factoryAddress} ${deployFee.toString()}`);
        }
    }

    console.log("\n✨ Deployment complete!");
    console.log("\n📋 Summary:");
    console.log("Network:", networkName);
    console.log("Chain ID:", hre.network.config.chainId);
    console.log("Factory Address:", factoryAddress);
    console.log("Deploy Fee:", hre.ethers.formatEther(deployFee), "tokens");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
