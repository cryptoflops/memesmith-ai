'use client';

import React from 'react';

type NavItem = 'home' | 'search' | 'add' | 'favorites' | 'wallet';

interface NavbarProps {
    activeTab: NavItem;
    onTabChange: (tab: NavItem) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="absolute bottom-6 left-6 right-6 h-20 bg-obsidian-card rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-between px-2 border border-obsidian-border z-50">
            <button
                onClick={() => onTabChange('home')}
                className="flex-1 flex flex-col items-center justify-center h-full group"
            >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transform transition-transform group-active:scale-95 ${activeTab === 'home' ? 'bg-secondary text-black' : 'text-gray-500 hover:text-white'}`}>
                    <span className="material-icons-round text-3xl">home</span>
                </div>
            </button>

            <button
                onClick={() => onTabChange('search')}
                className="flex-1 flex flex-col items-center justify-center h-full text-gray-500 hover:text-white transition-colors group"
            >
                <span className={`material-icons-round text-2xl mb-1 group-active:scale-90 transition-transform ${activeTab === 'search' ? 'text-white' : ''}`}>search</span>
            </button>

            <button
                onClick={() => onTabChange('add')}
                className="flex-1 flex flex-col items-center justify-center h-full text-gray-500 hover:text-white transition-colors group"
            >
                <div className="relative group-active:scale-90 transition-transform">
                    <span className={`material-icons-round text-3xl mb-1 ${activeTab === 'add' ? 'text-primary' : ''}`}>add_circle</span>
                </div>
            </button>

            <button
                onClick={() => onTabChange('favorites')}
                className="flex-1 flex flex-col items-center justify-center h-full text-gray-500 hover:text-white transition-colors group"
            >
                <span className={`material-icons-round text-2xl mb-1 group-active:scale-90 transition-transform ${activeTab === 'favorites' ? 'text-white' : ''}`}>favorite_border</span>
            </button>

            <button
                onClick={() => onTabChange('wallet')}
                className="flex-1 flex flex-col items-center justify-center h-full text-gray-500 hover:text-white transition-colors group"
            >
                <span className={`material-icons-round text-2xl mb-1 group-active:scale-90 transition-transform ${activeTab === 'wallet' ? 'text-white' : ''}`}>account_balance_wallet</span>
            </button>
        </nav>
    );
};
