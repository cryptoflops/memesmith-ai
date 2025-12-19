'use client';

import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ActionCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    color: 'yellow' | 'pink' | 'green' | 'coral' | 'purple' | 'cyan';
    onClick?: () => void;
}

export const ActionCard: FC<ActionCardProps> = ({ icon, title, description, color, onClick }) => {
    const colorMap = {
        yellow: 'bg-neon-yellow',
        green: 'bg-neon-green',
        pink: 'bg-neon-pink',
        cyan: 'bg-neon-cyan',
        purple: 'bg-neon-purple',
        coral: 'bg-neon-pink',
    };

    return (
        <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="glass-card p-4 flex items-center gap-4 cursor-pointer relative overflow-hidden group"
        >
            <div className="shimmer-container" />
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/80 group-hover:text-white transition-colors`}>
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="font-display text-base leading-tight">{title}</h3>
                <p className="text-xs opacity-40 font-medium">{description}</p>
            </div>
            <div className="opacity-20 group-hover:opacity-100 group-hover:text-neon-yellow transition-all">
                <ArrowUpRight size={20} />
            </div>

            <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorMap[color]} opacity-50`} />
        </motion.div>
    );
};

export default ActionCard;
