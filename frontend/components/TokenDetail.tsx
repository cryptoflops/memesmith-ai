'use client';

import { FC, useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther, Abi } from 'viem';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, TrendingUp, Info, Zap, ShieldCheck } from 'lucide-react';
import { useMemePrice } from '../hooks/useMemes';
import MemeBondingCurveArtifact from '../lib/abis/MemeBondingCurve.json';

const curveAbi = MemeBondingCurveArtifact.abi as Abi;

interface TokenDetailProps {
    token: {
        token: `0x${string}`;
        curve: `0x${string}`;
        name: string;
        symbol: string;
        initialSupply: bigint;
        curveSupply: bigint;
    };
    onBack: () => void;
}

export const TokenDetail: FC<TokenDetailProps> = ({ token, onBack }) => {
    const [amount, setAmount] = useState<string>('100');
    const { price, isLoading: isLoadingPrice } = useMemePrice(token.curve);
    const { isConnected } = useAccount();

    const { writeContractAsync, data: hash, isPending: isDeploying } = useWriteContract();
    const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({ hash });

    const handleBuy = async () => {
        if (!isConnected) return;
        try {
            const amountBigInt = BigInt(amount);
            const estimatedCost = parseEther((Number(price) * Number(amount) * 1.05).toFixed(18));

            await writeContractAsync({
                address: token.curve,
                abi: curveAbi,
                functionName: 'buy',
                args: [amountBigInt],
                value: estimatedCost,
            });
        } catch (e) {
            console.error('Buy failed:', e);
        }
    };

    const progress = 0; // Placeholder

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pb-24"
        >
            <header className="flex items-center gap-4 py-6">
                <button
                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/70 hover:text-white"
                    onClick={onBack}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-title text-xl">Forge Detail</h1>
            </header>

            <div className="glass-card overflow-hidden mb-6 relative">
                <div className="aspect-video bg-white/5 flex items-center justify-center opacity-20">
                    <Zap size={80} />
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-display text-3xl mb-1">{token.name}</h2>
                            <span className="text-neon-yellow font-black tracking-widest text-sm uppercase">${token.symbol}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1">Current Price</div>
                            <div className="text-xl font-display text-neon-blue">
                                {isLoadingPrice ? '...' : `${Number(price).toFixed(6)} CELO`}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mb-1">
                            <span className="opacity-40">Bonding Progress</span>
                            <span className="text-neon-green">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-neon-green shadow-green"
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute top-4 right-4 glass-card-sm px-2 py-1 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-neon-cyan" />
                    <span className="text-[10px] font-bold text-white/50">VERIFIED</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-card p-4">
                    <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Info size={12} /> Supply
                    </div>
                    <div className="text-xl font-display">{Number(token.initialSupply).toLocaleString()}</div>
                </div>
                <div className="glass-card p-4">
                    <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <TrendingUp size={12} /> Reserved
                    </div>
                    <div className="text-xl font-display text-neon-purple">{Number(token.curveSupply).toLocaleString()}</div>
                </div>
            </div>

            <div className="glass-card p-6 relative overflow-hidden">
                <div className="shimmer-container" />
                <h3 className="text-title mb-6 flex items-center gap-2">
                    <Rocket size={20} className="text-neon-yellow" /> Launch Buy
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-2 block">Quantity</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-display text-2xl focus:outline-none focus:border-neon-yellow/50 transition-colors"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-30">
                                {token.symbol}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-4 glass-card-sm">
                        <span className="text-xs font-bold opacity-40 uppercase tracking-widest">Est. Cost</span>
                        <span className="text-lg font-display text-neon-green">
                            {(Number(price) * Number(amount)).toFixed(6)} CELO
                        </span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl bg-neon-yellow text-black font-black text-lg shadow-yellow uppercase tracking-widest"
                        onClick={handleBuy}
                        disabled={isDeploying || isWaiting}
                    >
                        {isDeploying ? 'Signing...' : isWaiting ? 'Confirming...' : (
                            <span className="flex items-center justify-center gap-2">
                                <Rocket size={20} /> Execute Order
                            </span>
                        )}
                    </motion.button>

                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-neon-green text-sm font-bold uppercase tracking-widest mt-4"
                        >
                            Order Fulfilled Successfully! 🎉
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
