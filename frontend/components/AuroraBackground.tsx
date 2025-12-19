'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';

export const AuroraBackground: FC = () => {
    return (
        <div className="aurora-container">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(188, 0, 255, 0.2) 0%, transparent 70%)' }}
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -50, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0, 209, 255, 0.2) 0%, transparent 70%)' }}
            />
            <div className="noise-overlay" />
        </div>
    );
};
