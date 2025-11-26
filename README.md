# MemeSmith AI

AI-powered meme coin factory that analyzes Farcaster profiles to generate and deploy personalized tokens on multiple EVM chains.

## 🚀 Features

- **AI Profile Analysis**: Analyzes Farcaster profiles using GaiaNet AI
- **Token Generation**: Creates unique meme coins based on user identity
- **Multi-Chain Support**: Deploy on Celo, Base, Optimism, and Arbitrum
- **Farcaster Integration**: Full Farcaster Mini App with safe area support
- **Web3 Wallet**: Reown AppKit (WalletConnect v2) integration

## 📁 Project Structure

```
memesmith/
├── contracts/         # Hardhat smart contracts
│   ├── contracts/     # Solidity contracts
│   ├── scripts/       # Deployment scripts
│   └── deployments/   # Deployed contract addresses
└── frontend/          # Next.js frontend
    ├── components/    # React components
    ├── hooks/         # Custom React hooks
    ├── pages/         # Next.js pages & API routes
    └── public/        # Static assets & Farcaster manifest
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v2, Viem, Reown AppKit
- **Farcaster**: @farcaster/miniapp-sdk

### Smart Contracts
- **Framework**: Hardhat
- **Language**: Solidity ^0.8.20
- **Networks**: Celo, Base, Optimism, Arbitrum

### AI & APIs
- **AI**: GaiaNet (OpenAI-compatible)
- **Image Generation**: OpenAI DALL-E
- **Storage**: Pinata (IPFS)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd memesmith
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install contract dependencies
   cd ../contracts
   npm install
   ```

3. **Configure environment variables**

   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_MEME_FACTORY_ADDRESS=deployed_factory_address
   OPENAI_API_KEY=your_openai_api_key
   PINATA_JWT=your_pinata_jwt
   ```

   **Contracts** (`contracts/.env`):
   ```env
   PRIVATE_KEY=your_deployer_private_key
   CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
   BASE_RPC_URL=https://sepolia.base.org
   OPTIMISM_RPC_URL=https://sepolia.optimism.io
   ARBITRUM_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
   ```

### Development

**Run frontend dev server:**
```bash
cd frontend
npm run dev
```

**Deploy contracts:**
```bash
cd contracts
npx hardhat run scripts/deploy.js --network celoSepolia
```

## 📝 Smart Contracts

### MemeCoinFactory
Main factory contract for deploying meme coins with bonding curve mechanics.

**Deployed Addresses:**
- Celo Sepolia: `[address from deployments]`
- Base Sepolia: `[address from deployments]`
- Optimism Sepolia: `[address from deployments]`
- Arbitrum Sepolia: `[address from deployments]`

## 🌐 Deployment

### Vercel Deployment

The frontend is deployed on Vercel with automatic builds from the main branch.

**Live URL**: https://memesmith-4xr281jf2-cryptoflops00-3036s-projects.vercel.app

### Farcaster Mini App

The app is configured as a Farcaster Mini App with:
- Manifest at `/.well-known/farcaster.json`
- Webhook endpoint at `/api/webhook`
- Safe area inset support
- Share and Add to Home functionality

## 🔐 Security

- Private keys stored in `.env` files (never committed)
- Webhook signature verification (to be implemented)
- Smart contract auditing recommended before mainnet

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Contact

For questions or support, please open an issue on GitHub.
