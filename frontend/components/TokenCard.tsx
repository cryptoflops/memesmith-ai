'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { useMemePrice } from '../hooks/useMemes';
import { Zap } from 'lucide-react';

interface TokenCardProps {
    name: string;
    symbol: string;
    curveAddress?: `0x${string}`;
    imageUrl?: string;
    onClick?: () => void;
}

export const TokenCard: FC<TokenCardProps> = ({ name, symbol, curveAddress, imageUrl, onClick }) => {
    const { price } = useMemePrice(curveAddress);

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-obsidian-card border border-obsidian-border rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
        >
            <div className="aspect-square relative overflow-hidden bg-zinc-900 flex items-center justify-center">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                        <Zap size={48} className="text-zinc-500" />
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-obsidian-bg/80 backdrop-blur-md border border-obsidian-border px-2 py-1 rounded-lg flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
                    <span className="text-[10px] font-bold text-white/70">LIVE</span>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-bold text-sm truncate max-w-[70%]">{name}</h3>
                    <span className="text-secondary text-[10px] font-black tracking-tighter uppercase">${symbol}</span>
                </div>
                <div className="flex justify-between items-center bg-obsidian-highlight/50 p-2 rounded-lg border border-obsidian-border">
                    <div className="text-[10px] opacity-40 font-bold uppercase tracking-widest">Price</div>
                    <div className="text-xs font-bold text-primary">
                        {price ? `${price.toFixed(6)} CELO` : '0.00...'}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TokenCard;
