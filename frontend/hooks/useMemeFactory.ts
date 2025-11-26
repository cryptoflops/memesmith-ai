'use client';

import { useAccount, useWriteContract, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { baseSepolia, optimismSepolia, arbitrumSepolia } from 'wagmi/chains';
import MemeFactoryArtifact from '../artifacts/contracts/MemeCoinFactory.sol/MemeCoinFactory.json';

const factoryAbi = MemeFactoryArtifact.abi;

// Define Celo Sepolia manually for wagmi v1
const celoSepolia = {
  id: 11142220,
  name: 'Celo Sepolia Testnet',
  network: 'celo-sepolia',
  nativeCurrency: { decimals: 18, name: 'CELO', symbol: 'CELO' },
  rpcUrls: {
    default: { http: ['https://alfajores-forno.celo-testnet.org'] },
    public: { http: ['https://alfajores-forno.celo-testnet.org'] },
  },
  blockExplorers: {
    default: { name: 'CeloScan', url: 'https://sepolia.celoscan.io' },
  },
  testnet: true,
};

const CHAINS = {
  [celoSepolia.id]: celoSepolia,
  [baseSepolia.id]: baseSepolia,
  [optimismSepolia.id]: optimismSepolia,
  [arbitrumSepolia.id]: arbitrumSepolia,
};

// Address map for different chains
const FACTORY_ADDRESSES: Record<number, `0x${string}`> = {
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
    const deployFee = parseEther('0.5'); // 0.5 Native Token fee

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