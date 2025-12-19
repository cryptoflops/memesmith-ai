'use client';

import { FC } from 'react';

interface NavItem {
    id: string;
    label: string;
    icon: string;
}

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'create', label: 'Create', icon: '✨' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
];

export const BottomNav: FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => onTabChange(item.id)}
                    aria-current={activeTab === item.id ? 'page' : undefined}
                    aria-label={item.label}
                >
                    <span className="nav-item-icon" role="img" aria-hidden="true">
                        {item.icon}
                    </span>
                    <span className="nav-item-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
