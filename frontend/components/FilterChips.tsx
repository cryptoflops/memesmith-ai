'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';

interface FilterChipsProps {
    options: string[];
    activeOption: string;
    onChange: (option: string) => void;
}

export const FilterChips: FC<FilterChipsProps> = ({ options, activeOption, onChange }) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {options.map((option) => (
                <motion.button
                    key={option}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onChange(option)}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeOption === option
                            ? 'bg-neon-yellow text-black shadow-yellow'
                            : 'glass-card text-white/50 hover:text-white'
                        }`}
                >
                    {option}
                </motion.button>
            ))}
        </div>
    );
};

export default FilterChips;
