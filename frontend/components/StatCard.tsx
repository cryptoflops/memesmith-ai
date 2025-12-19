'use client';

import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string;
    color: 'yellow' | 'pink' | 'green' | 'coral' | 'purple' | 'cyan';
}

export const StatCard: FC<StatCardProps> = ({ icon, label, value, color }) => {
    const colorMap = {
        yellow: 'text-neon-yellow',
        green: 'text-neon-green',
        pink: 'text-neon-pink',
        cyan: 'text-neon-cyan',
        purple: 'text-neon-purple',
        coral: 'text-neon-pink',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 relative overflow-hidden group"
        >
            <div className={`mb-3 ${colorMap[color]} opacity-50 group-hover:opacity-100 transition-opacity`}>
                {icon}
            </div>
            <div className="space-y-0.5">
                <div className="text-2xl font-display leading-none tracking-tight">{value}</div>
                <div className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{label}</div>
            </div>
            <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 pointer-events-none translate-x-1/3 -translate-y-1/3 blur-xl rounded-full ${color === 'yellow' ? 'bg-neon-yellow' : 'bg-neon-green'}`} />
        </motion.div>
    );
};

export default StatCard;
