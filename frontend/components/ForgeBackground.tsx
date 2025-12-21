'use client';

import React from 'react';

export const ForgeBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base colors */}
            <div className="absolute inset-0 bg-obsidian-bg"></div>

            {/* Gradient Overlay from 3.rtf */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#18181b] via-[#09090b] to-[#000000] opacity-80"></div>

            {/* Blur circles from 2.rtf */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]"></div>

            {/* Subtlest secondary glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vibe-purple/5 rounded-full blur-[150px]"></div>
        </div>
    );
};
