'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import type { Abi } from 'viem';

// Adjust this path if needed depending on where artifacts live relative to frontend
import MemeTokenArtifact from '../artifacts/contracts/MemeToken.sol/MemeToken.json';

// Type hint for the artifact
const memeTokenAbi = MemeTokenArtifact.abi as Abi;

const MEME_DECIMALS = BigInt(18);

export function useMemeToken() {
  const { address, chain } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const contractAddress = process.env.NEXT_PUBLIC_MEMETOKEN_ADDRESS as `0x${string}`;

  // totalSupply()
  const { data: totalSupply } = useReadContract({
    address: contractAddress,
    abi: memeTokenAbi,
    functionName: 'totalSupply',
    query: {
      enabled: Boolean(contractAddress),
    },
  });

  // balanceOf(address)
  const { data: balance } = useReadContract({
    address: contractAddress,
    abi: memeTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && contractAddress),
    },
  });

  // transfer(to, amount) – example: send 1 MEME to burn address
  const oneMeme = BigInt(10) ** MEME_DECIMALS;

  const transfer = async () => {
    if (!address || !contractAddress || !chain) return;

    await writeContractAsync({
      account: address,
      chain: chain,
      address: contractAddress,
      abi: memeTokenAbi,
      functionName: 'transfer',
      args: ['0x000000000000000000000000000000000000dEaD', oneMeme],
    });
  };

  return {
    address,
    balance,
    totalSupply,
    transfer,
  };
}
