const hre = require("hardhat");

async function checkBalance(networkName) {
    try {
        console.log(`\n📊 Checking ${networkName}...`);

        // Get the network by changing hardhat runtime
        await hre.changeNetwork(networkName);

        const [signer] = await hre.ethers.getSigners();
        const address = await signer.getAddress();
        const balance = await hre.ethers.provider.getBalance(address);
        const balanceEth = hre.ethers.formatEther(balance);

        console.log(`   Address: ${address}`);
        console.log(`   Balance: ${balanceEth} (${balance.toString()} wei)`);

        // Warn if balance is low
        const minBalance = hre.ethers.parseEther("0.01");
        if (balance < minBalance) {
            console.log(`   ⚠️  Warning: Balance is low! You may need more funds.`);
            return false;
        } else {
            console.log(`   ✅ Sufficient balance`);
            return true;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return false;
    }
}

async function main() {
    const networks = ["celoSepolia", "baseSepolia", "optimismSepolia", "arbitrumSepolia"];

    console.log("🔍 Checking wallet balances across all testnets...\n");
    console.log("=".repeat(60));

    const results = {};
    for (const network of networks) {
        results[network] = await checkBalance(network);
    }

    console.log("\n" + "=".repeat(60));
    console.log("\n📋 Summary:");

    for (const [network, sufficient] of Object.entries(results)) {
        const status = sufficient ? "✅" : "❌";
        console.log(`${status} ${network}`);
    }

    const allGood = Object.values(results).every(v => v);

    if (allGood) {
        console.log("\n🎉 All networks have sufficient balance!");
        console.log("\nYou can now deploy with:");
        console.log("npx hardhat run scripts/deployAllChains.js --network <network-name>");
    } else {
        console.log("\n⚠️  Some networks need funding. See faucet links in deployment_plan.md");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
