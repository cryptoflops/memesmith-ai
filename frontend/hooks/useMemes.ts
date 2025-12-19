'use client';

import { useReadContract, useReadContracts } from 'wagmi';
import { celo, celoSepolia, base, baseSepolia, optimism, optimismSepolia, arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { Abi } from 'viem';
import MemeFactoryArtifact from '../lib/abis/MemeCoinFactory.json';
import MemeBondingCurveArtifact from '../lib/abis/MemeBondingCurve.json';

const factoryAbi = MemeFactoryArtifact.abi as Abi;
const curveAbi = MemeBondingCurveArtifact.abi as Abi;

const FACTORY_ADDRESSES: Record<number, `0x${string}`> = {
    [42220]: '0xa45ca882C694e57D4Cc7eCf61C68b6d9dC5eB9dE', // Celo Mainnet
    [11142220]: '0x17C593d0Cbdb4B954e234D2184a73b86CE2051E8', // Celo Sepolia
    [base.id]: '0x379248e57299dAF605B1dF921bf4A0eD2eFE2F23',
    [optimism.id]: '0xa45ca882C694e57D4Cc7eCf61C68b6d9dC5eB9dE',
    [arbitrum.id]: '0xB5D511dD402DA6428419633e883fda21c9F8aD67',
};

export type MemeMetadata = {
    id: number;
    token: `0x${string}`;
    curve: `0x${string}`;
    creator: `0x${string}`;
    name: string;
    symbol: string;
    initialSupply: bigint;
    curveSupply: bigint;
    price?: string;
};

export function useMemes(chainId: number = 11142220) {
    const factoryAddress = FACTORY_ADDRESSES[chainId];

    // 1. Get total count of memes
    const { data: count } = useReadContract({
        address: factoryAddress,
        abi: factoryAbi,
        functionName: 'memesCount',
        chainId,
    });

    // 2. Fetch all meme info if count > 0
    const memeIndices = count ? Array.from({ length: Number(count) }, (_, i) => i) : [];

    const { data: memesData, isLoading: isLoadingMemes } = useReadContracts({
        contracts: memeIndices.map((index) => ({
            address: factoryAddress,
            abi: factoryAbi,
            functionName: 'memes',
            args: [BigInt(index)],
            chainId,
        })),
    });

    const memes: MemeMetadata[] = memesData
        ? memesData.map((res: any, index) => {
            if (!res.result) return null;
            const [token, curve, creator, name, symbol, initialSupply, curveSupply] = res.result;
            return {
                id: index,
                token,
                curve,
                creator,
                name,
                symbol,
                initialSupply,
                curveSupply
            };
        }).filter((m): m is MemeMetadata => m !== null)
        : [];

    return {
        memes: memes.reverse(), // Show newest first
        isLoading: isLoadingMemes,
        count: Number(count || 0),
    };
}

export function useMemePrice(curveAddress?: `0x${string}`, chainId: number = 11142220) {
    const { data: sold } = useReadContract({
        address: curveAddress,
        abi: curveAbi,
        functionName: 'sold',
        chainId,
    });

    const { data: cost } = useReadContract({
        address: curveAddress,
        abi: curveAbi,
        functionName: 'getCost',
        args: [sold || BigInt(0), BigInt(1)], // Cost for 1 token
        chainId,
        query: {
            enabled: !!curveAddress && sold !== undefined,
        }
    });

    return {
        price: cost ? (Number(cost) / 1e18) : 0,
        isLoading: !cost,
    };
}
