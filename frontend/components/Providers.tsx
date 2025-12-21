'use client';

import { createAppKit } from '@reown/appkit/react';
import type { AppKitNetwork } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    celo,
    base,
    baseSepolia,
    optimism,
    optimismSepolia,
    arbitrum,
    arbitrumSepolia,
} from 'wagmi/chains';
import { ReactNode } from 'react';

// Define Celo Sepolia manually just in case
const celoSepolia = {
    id: 11142220,
    name: 'Celo Sepolia Testnet',
    network: 'celo-sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'CELO',
        symbol: 'CELO',
    },
    rpcUrls: {
        default: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
        public: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
    },
    blockExplorers: {
        default: { name: 'Celo Sepolia Explorer', url: 'https://celo-sepolia.blockscout.com' },
    },
    testnet: true,
};

// Setup QueryClient
const queryClient = new QueryClient();

// Define chains
const chains = [
    celo,
    celoSepolia,
    base,
    baseSepolia,
    optimism,
    optimismSepolia,
    arbitrum,
    arbitrumSepolia,
];

// Project ID from environment
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '';

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
    networks: chains as any,
    projectId,
    ssr: true
});

// Create AppKit
createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: chains as unknown as [AppKitNetwork, ...AppKitNetwork[]],
    metadata: {
        name: 'MemeSmith AI',
        description: 'AI-Powered Meme Coin Factory',
        url: 'https://memesmith.ai',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
    },
    features: {
        analytics: false,
    }
});

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
