'use client';

import { useAccount, useWriteContract, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import {
  base, baseSepolia,
  optimism, optimismSepolia,
  arbitrum, arbitrumSepolia,
  celo
} from 'wagmi/chains';
import MemeFactoryArtifact from '../lib/abis/MemeCoinFactory.json';

const factoryAbi = MemeFactoryArtifact.abi;

// Define Celo Sepolia manually for wagmi v1
const celoSepolia = {
  id: 11142220,
  name: 'Celo Sepolia Testnet',
  network: 'celo-sepolia',
  nativeCurrency: { decimals: 18, name: 'CELO', symbol: 'CELO' },
  rpcUrls: {
    default: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
    public: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
  },
  blockExplorers: {
    default: { name: 'Celo Sepolia Explorer', url: 'https://celo-sepolia.blockscout.com' },
  },
  testnet: true,
};

const CHAINS = {
  [celo.id]: celo,
  [celoSepolia.id]: celoSepolia,
  [base.id]: base,
  [baseSepolia.id]: baseSepolia,
  [optimism.id]: optimism,
  [optimismSepolia.id]: optimismSepolia,
  [arbitrum.id]: arbitrum,
  [arbitrumSepolia.id]: arbitrumSepolia,
};

// Address map for different chains
const FACTORY_ADDRESSES: Record<number, `0x${string}`> = {
  // Mainnets (Deployed with 0 fee - set fee using setDeployFee)
  [celo.id]: '0xa45ca882C694e57D4Cc7eCf61C68b6d9dC5eB9dE',
  [base.id]: '0x379248e57299dAF605B1dF921bf4A0eD2eFE2F23',
  [optimism.id]: '0xa45ca882C694e57D4Cc7eCf61C68b6d9dC5eB9dE',
  [arbitrum.id]: '0xB5D511dD402DA6428419633e883fda21c9F8aD67', // Old deployment - pending redeploy

  // Testnets
  [celoSepolia.id]: '0x17C593d0Cbdb4B954e234D2184a73b86CE2051E8', // Celo Sepolia
  [baseSepolia.id]: '0xB5D511dD402DA6428419633e883fda21c9F8aD67', // Base Sepolia
  [optimismSepolia.id]: '0xB5D511dD402DA6428419633e883fda21c9F8aD67', // Optimism Sepolia
  [arbitrumSepolia.id]: '0xB5D511dD402DA6428419633e883fda21c9F8aD67', // Arbitrum Sepolia
};

export function useMemeFactory(chainId: number = celoSepolia.id) {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending: isLoading } = useWriteContract();

  const factoryAddress = process.env.NEXT_PUBLIC_MEME_FACTORY_ADDRESS as `0x${string}` || FACTORY_ADDRESSES[chainId];

  const launchMemeFromIdea = async (idea: { name: string; symbol: string }, targetChainId?: number) => {
    if (!address) throw new Error('Wallet not connected');

    const finalChainId = targetChainId || chainId;

    // Switch chain if needed
    if (switchChainAsync) {
      try {
        await switchChainAsync({ chainId: finalChainId });
      } catch (error) {
        console.error('Failed to switch chain:', error);
        // Continue anyway as user might already be on correct chain
      }
    }

    if (!factoryAddress) throw new Error(`Factory not deployed on chain ${finalChainId}`);

    // Default parameters
    const basePriceWei = parseEther('0.001');
    const pricePerTokenWei = parseEther('0.00005');
    const initialSupply = BigInt(1_000_000);
    const curveSupply = BigInt(500_000);
    // Dynamic deploy fee based on chain
    let deployFee = parseEther('0.0001'); // Default 0.0001 ETH for L2s (Base, OP, Arb)

    // Celo chains (Mainnet: 42220, Sepolia: 11142220) use 1 CELO
    if (finalChainId === 42220 || finalChainId === 11142220) {
      deployFee = parseEther('1');
    }

    const tx = await writeContractAsync({
      address: factoryAddress,
      abi: factoryAbi,
      functionName: 'createMemeWithCurve',
      args: [
        idea.name,
        idea.symbol,
        basePriceWei,
        pricePerTokenWei,
        initialSupply,
        curveSupply,
      ],
      value: deployFee,
    });

    return { hash: tx };
  };

  return {
    launchMemeFromIdea,
    isLoading,
  };
}