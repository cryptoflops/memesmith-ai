# MemeSmith AI 🧪

> Forge your Farcaster identity into a personalized meme coin with AI

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://memesmith-ai.vercel.app)
[![Farcaster Mini App](https://img.shields.io/badge/Farcaster-Mini%20App-purple)](https://warpcast.com)
[![Built on Celo](https://img.shields.io/badge/Built%20on-Celo-fcff52)](https://celo.org)

![MemeSmith AI Banner](https://via.placeholder.com/1200x400/000000/39FF14?text=MemeSmith+AI)

## ✨ Features

- **🤖 AI-Powered Analysis** - Analyzes your Farcaster profile (bio, casts, followers) to understand your online persona
- **🎨 Generative Art** - Creates unique token logos using AI image generation
- **⛓️ Multi-Chain Deployment** - Deploy your meme coin on Celo, Base, Optimism, or Arbitrum
- **📱 Farcaster Native** - Built as a Farcaster Mini App with seamless wallet integration
- **💰 Built-in Bonding Curve** - Tokens launch with a built-in bonding curve for fair price discovery

## 🏗️ Architecture

```
memesmith/
├── frontend/          # Next.js 14 + Reown AppKit
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks (useMemeFactory)
│   ├── pages/
│   │   ├── api/       # API routes
│   │   │   ├── analyze-profile.ts  # Profile analysis + AI
│   │   │   ├── generate-asset.ts   # Image generation
│   │   │   └── gaia.ts             # GaiaNet AI endpoint
│   │   └── index.tsx  # Main app
│   └── public/        # Static assets + farcaster.json
│
└── contracts/         # Hardhat + Solidity
    ├── contracts/
    │   ├── MemeCoinFactory.sol    # Factory contract
    │   ├── MemeCoin.sol           # ERC20 token template
    │   └── MemeBondingCurve.sol   # Bonding curve logic
    └── scripts/       # Deployment scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A wallet with testnet tokens (for deployment)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

### Smart Contracts

```bash
cd contracts
npm install
cp .env.example .env
# Add your PRIVATE_KEY to .env
npx hardhat compile
npx hardhat run scripts/deploy.js --network celoSepolia
```

## 🔧 Environment Variables

### Frontend (`.env.local`)

```env
# WalletConnect / Reown AppKit
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id

# Farcaster Profile Data (Free tier: 300 req/min)
NEYNAR_API_KEY=your_neynar_api_key

# AI Text Generation - GaiaNet (Free, decentralized)
GAIANET_API_URL=https://llama.gaia.domains/v1

# AI Image Generation - Hugging Face (Optional)
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### Contracts (`.env`)

```env
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_v2_api_key
```

## 🌐 Deployed Contracts

| Network | Factory Address | Explorer |
|---------|-----------------|----------|
| Celo Mainnet | `0xa45ca882C694e57D4Cc7eCf61C68b6d9dC5eB9dE` | [CeloScan](https://celoscan.io/address/0xa45ca882C694e57D4Cc7eCf61C68b6d9dC5eB9dE) |
| Base Mainnet | `0x379248e57299dAF605B1dF921bf4A0eD2eFE2F23` | [BaseScan](https://basescan.org/address/0x379248e57299dAF605B1dF921bf4A0eD2eFE2F23) |
| Optimism | `0xa45ca882C694e57D4Cc7eCf61C68b6d9dC5eB9dE` | [OP Etherscan](https://optimistic.etherscan.io/address/0xa45ca882C694e57D4Cc7eCf61C68b6d9dC5eB9dE) |
| Arbitrum One | `0xB5D511dD402DA6428419633e883fda21c9F8aD67` | [Arbiscan](https://arbiscan.io/address/0xB5D511dD402DA6428419633e883fda21c9F8aD67) |

## 💸 Deployment Fees

| Network | Fee |
|---------|-----|
| Celo | 1 CELO |
| Base | 0.0001 ETH |
| Optimism | 0.0001 ETH |
| Arbitrum | 0.0001 ETH |

## 🛡️ Security

- All smart contracts are verified on block explorers
- Implements reentrancy protection
- Safe withdrawal pattern using `.call()` instead of `.transfer()`
- Ownership transferred to creator on token deployment
- Integral-based bonding curve for fair pricing

## 🔌 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Wallet**: Reown AppKit, wagmi v2, viem
- **AI**: GaiaNet (text), Pollinations.ai / Hugging Face (images)
- **Data**: Neynar API for Farcaster profiles
- **Blockchain**: Solidity 0.8.20, Hardhat, OpenZeppelin
- **Hosting**: Vercel

## 📱 Farcaster Integration

MemeSmith AI is built as a Farcaster Mini App. To add it to your client:

1. Open Warpcast or compatible Farcaster client
2. Navigate to the app URL
3. Click "Add to Home" to install

The app implements:
- `fc:miniapp` meta tags
- Safe area handling for mobile
- Cast composer integration
- Native wallet connection

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

**Built with 💚 for the Celo and Farcaster communities**
