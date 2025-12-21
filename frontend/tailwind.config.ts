import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'neon-green': '#39FF14',
                'neon-purple': '#BC13FE',
                'primary': '#3b82f6',
                'primary-hover': '#2563eb',
                'secondary': '#facc15',
                'accent': '#eeff00',
                'obsidian-bg': '#09090b',
                'obsidian-card': '#18181b',
                'obsidian-border': '#27272a',
                'obsidian-highlight': '#3f3f46',
                'accent-yellow': '#fef08a',
                'accent-pink': '#f472b6',
                'accent-green': '#a3e635',
                'vibe-purple': '#a855f7',
                'background-light': '#fdf4ff',
            },
            fontFamily: {
                'display': ['Plus Jakarta Sans', 'sans-serif'],
                'heading': ['Space Grotesk', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
                'sans': ['Inter', 'sans-serif'],
            },
            borderRadius: {
                'DEFAULT': '1rem',
                'xl': '1.5rem',
                '2xl': '2rem',
                '3xl': '3rem',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 12s linear infinite',
                'bounce-slow': 'bounce 3s infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
};
export default config;
