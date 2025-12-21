'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMemeFactory } from '../hooks/useMemeFactory';
import { useMemes } from '../hooks/useMemes';
import { Navbar } from './Navbar';
import { ForgeBackground } from './ForgeBackground';
import { TokenCard } from './TokenCard';
import { TokenDetail } from './TokenDetail';
import { MemeMetadata } from '../hooks/useMemes';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, ArrowRight, Star, Infinity, Settings } from 'lucide-react';

type Screen = 'welcome' | 'home' | 'create' | 'gallery' | 'profile' | 'search' | 'favorites' | 'wallet';

export default function App() {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<any | undefined>();
    const [activeScreen, setActiveScreen] = useState<Screen>('welcome');
    const [createStep, setCreateStep] = useState<'start' | 'review' | 'art' | 'deploy' | 'success'>('start');
    const [selectedMeme, setSelectedMeme] = useState<MemeMetadata | null>(null);

    // AI & Chain State (kept from original)
    const [idea, setIdea] = useState<any | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedChain, setSelectedChain] = useState<number>(11142220); // Default to Celo Sepolia
    const { launchMemeFromIdea } = useMemeFactory(selectedChain);
    const { memes, isLoading: isLoadingMemes, count } = useMemes(selectedChain);
    const { isConnected, address } = useAccount();

    useEffect(() => {
        const initFarcaster = async () => {
            try {
                const farcasterSdk = await import('@farcaster/miniapp-sdk');
                const sdkInstance = farcasterSdk.default || farcasterSdk;
                if (sdkInstance.actions?.ready) {
                    sdkInstance.actions.ready();
                }
                const ctx = await sdkInstance.context;
                setContext(ctx);
                setIsSDKLoaded(true);
            } catch (e) {
                console.error('SDK init failed:', e);
                setIsSDKLoaded(true);
            }
        };
        initFarcaster();
    }, []);

    if (!isSDKLoaded) {
        return (
            <div className="min-h-screen bg-obsidian-bg flex items-center justify-center font-heading">
                <div className="text-center">
                    <div className="text-4xl mb-4 animate-bounce">⚡</div>
                    <p className="text-white opacity-50 uppercase tracking-widest text-xs">Forging Environment...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-[100dvh] relative overflow-x-hidden font-body text-white selection:bg-accent-pink selection:text-white">
            <ForgeBackground />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md mx-auto min-h-[100dvh] flex flex-col">
                <AnimatePresence mode="wait">
                    {/* ===== WELCOME SCREEN (3.rtf) ===== */}
                    {activeScreen === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col justify-between"
                        >
                            {/* Header Icons */}
                            <div className="px-6 pt-10 pb-4">
                                <div className="flex justify-between items-center mb-10 px-2">
                                    <div className="w-12 h-12 rounded-full bg-obsidian-card flex items-center justify-center shadow-lg transform -rotate-6 border border-obsidian-border">
                                        <Star className="text-pink-400 w-6 h-6" />
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-obsidian-card/80 backdrop-blur-sm shadow-md flex items-center justify-center border border-obsidian-border">
                                        <Infinity className="text-gray-400 w-6 h-6" />
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-obsidian-card shadow-md flex items-center justify-center border border-obsidian-border">
                                        <Settings className="text-lime-400 w-6 h-6" />
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-obsidian-card shadow-md flex items-center justify-center border border-obsidian-border">
                                        <Sparkles className="text-blue-400 w-6 h-6" />
                                    </div>
                                </div>

                                {/* Marquee */}
                                <div className="overflow-hidden bg-white/5 py-2 mb-1 backdrop-blur-sm -mx-6 transform -rotate-1 border-y border-white/5">
                                    <div className="flex animate-[marquee_15s_linear_infinite] whitespace-nowrap text-sm font-bold tracking-widest text-zinc-500">
                                        <span className="mx-4 uppercase">CREATE! • MINT! • LAUNCH! • CREATE! • MINT! • LAUNCH! • CREATE! • MINT! • LAUNCH! • </span>
                                        <span className="mx-4 uppercase">CREATE! • MINT! • LAUNCH! • CREATE! • MINT! • LAUNCH! • CREATE! • MINT! • LAUNCH! • </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden bg-zinc-800/90 py-2 mb-8 backdrop-blur-md -mx-6 transform rotate-1 shadow-lg border-y border-white/10">
                                    <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap text-sm font-bold tracking-widest text-white">
                                        <span className="mx-4 uppercase">MEME MAGIC • ON CHAIN • MEME MAGIC • ON CHAIN • MEME MAGIC • ON CHAIN • </span>
                                        <span className="mx-4 uppercase">MEME MAGIC • ON CHAIN • MEME MAGIC • ON CHAIN • MEME MAGIC • ON CHAIN • </span>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Text */}
                            <div className="px-8 space-y-4 -mt-4 flex-1 flex flex-col justify-center">
                                <div className="space-y-0 relative">
                                    <div className="flex items-center space-x-2">
                                        <h1 className="text-[3.5rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500 tracking-tighter leading-none drop-shadow-sm font-heading" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>FORGE</h1>
                                        <div className="h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce-slow shadow-sm rotate-12 border border-yellow-200">
                                            <Zap size={18} className="text-black font-bold fill-current" />
                                        </div>
                                    </div>
                                    <h1 className="text-[3.5rem] font-bold text-white tracking-tighter leading-[0.9] drop-shadow-lg font-heading">
                                        YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-extrabold">VIBE</span>
                                    </h1>
                                    <div className="flex items-center space-x-3 pt-1">
                                        <Star className="text-pink-500 w-10 h-10 animate-pulse fill-current" />
                                        <h1 className="text-[3.5rem] font-bold text-pink-500 tracking-tighter leading-none font-heading" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>INTO</h1>
                                    </div>
                                    <div className="relative pt-2">
                                        <div className="absolute right-0 -top-6 transform rotate-[8deg]">
                                            <span className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-gray-100 uppercase tracking-wide">AI Powered</span>
                                        </div>
                                        <h1 className="text-[4.5rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 tracking-tighter filter drop-shadow-md leading-none pb-2 font-heading" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}>
                                            CRYPTO
                                        </h1>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-lg font-medium max-w-[95%] pt-6 leading-relaxed">
                                    Turn your digital persona into a personalized memecoin instantly. No code. Just vibes.
                                </p>
                            </div>

                            {/* Footer Action */}
                            <div className="px-6 pb-12 pt-4">
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <div className="flex space-x-2">
                                        <div className="w-10 h-6 bg-zinc-800 rounded-full relative border border-zinc-700">
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-pink-500 rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        Powered by Farcaster
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveScreen('home')}
                                    className="group w-full bg-primary hover:bg-primary-hover text-white text-lg font-bold py-5 px-6 rounded-[2rem] transition-all duration-300 transform hover:scale-[1.01] shadow-xl shadow-blue-900/40 flex items-center justify-between relative overflow-hidden border border-blue-400/20"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                    <span className="relative z-10 ml-2 uppercase font-heading">Get Started</span>
                                    <div className="relative z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                                <div className="w-full flex justify-center mt-8 mb-2">
                                    <div className="w-[35%] h-1.5 bg-gray-700 rounded-full opacity-80"></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ===== HOME SCREEN (1.rtf) ===== */}
                    {activeScreen === 'home' && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 pb-32"
                        >
                            <header className="px-6 py-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-obsidian-border bg-orange-200 p-2 flex items-center justify-center">
                                        <span className="material-icons-round text-orange-900 text-2xl">smartphone</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Welcome back,</p>
                                        <h1 className="text-xl font-bold text-white font-display uppercase tracking-tight">
                                            {context?.user?.displayName || 'Alex Forge'}
                                        </h1>
                                    </div>
                                </div>
                                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-obsidian-card shadow-sm text-white hover:bg-obsidian-highlight transition-colors border border-obsidian-border">
                                    <span className="material-icons-round text-xl">search</span>
                                </button>
                            </header>

                            <main className="px-6 space-y-8">
                                <section>
                                    <div className="flex justify-between items-end mb-4">
                                        <h2 className="text-xl font-bold font-heading">Recommended</h2>
                                        <button className="text-sm font-medium text-primary hover:text-blue-400">See All</button>
                                    </div>
                                    <div className="flex overflow-x-auto -mx-6 px-6 pb-6 gap-4 hide-scrollbar snap-x snap-mandatory">
                                        {/* Trending Item 1 */}
                                        <div className="snap-center shrink-0 w-[260px] relative group cursor-pointer">
                                            <div className="absolute top-3 left-3 z-10 bg-secondary text-black text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider">Trending</div>
                                            <div className="h-[340px] rounded-[2rem] overflow-hidden relative shadow-md bg-obsidian-card border border-obsidian-border">
                                                <div className="h-[240px] bg-zinc-800 flex items-center justify-center">
                                                    <Sparkles className="w-12 h-12 text-zinc-600" />
                                                </div>
                                                <div className="absolute top-[220px] right-5 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                    <ArrowRight className="text-black" />
                                                </div>
                                                <div className="p-5 pt-6">
                                                    <h3 className="text-xl font-bold text-white leading-tight font-display">Gasanova Coin</h3>
                                                    <p className="text-sm text-gray-400 mt-1">@yunggravy</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Trending Item 2 */}
                                        <div className="snap-center shrink-0 w-[260px] relative group cursor-pointer">
                                            <div className="absolute top-3 left-3 z-10 bg-pink-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider">New Drop</div>
                                            <div className="h-[340px] rounded-[2rem] overflow-hidden relative shadow-md bg-obsidian-card border border-obsidian-border">
                                                <div className="h-[240px] bg-zinc-900 flex items-center justify-center">
                                                    <Zap className="w-12 h-12 text-zinc-700" />
                                                </div>
                                                <div className="absolute top-[220px] right-5 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                    <ArrowRight className="text-black" />
                                                </div>
                                                <div className="p-5 pt-6">
                                                    <h3 className="text-xl font-bold text-white leading-tight font-display">DemiDev Token</h3>
                                                    <p className="text-sm text-gray-400 mt-1">@ashnikko</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex justify-between items-end mb-4">
                                        <h2 className="text-xl font-bold font-heading">Recently Forged</h2>
                                        <button className="text-sm font-medium text-primary hover:text-blue-400">View History</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-600 rounded-[2rem] p-5 relative overflow-hidden h-48 flex flex-col justify-between cursor-pointer group hover:bg-blue-500 transition-colors shadow-sm">
                                            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-[6px] border-blue-500 opacity-50"></div>
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                                <TrendingUp size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-xl leading-tight font-display">Identity<br />Alpha</h3>
                                                <p className="text-blue-100 text-xs mt-1 font-medium">Minted 2h ago</p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary rounded-[2rem] p-5 relative overflow-hidden h-48 flex flex-col justify-between cursor-pointer group hover:brightness-110 transition-all shadow-sm">
                                            <div className="absolute -right-6 -top-6">
                                                <Sparkles size={120} className="text-black/10 rotate-12" />
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center text-black relative z-10">
                                                <Zap size={24} />
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="text-black font-bold text-xl leading-tight font-display">Pixel<br />Punk #88</h3>
                                                <p className="text-black/70 text-xs mt-1 font-medium">Minted 5h ago</p>
                                            </div>
                                        </div>
                                        <div className="bg-pink-200 rounded-[2rem] p-5 relative overflow-hidden h-48 flex flex-col justify-between col-span-2 cursor-pointer group shadow-sm">
                                            <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-pink-900">
                                                <Sparkles size={24} />
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="text-pink-900 font-bold text-xl leading-tight font-display">Collective Consciousness</h3>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-pink-800 text-xs font-medium">Forged by @dwr</p>
                                                    <span className="bg-white/50 px-2 py-1 rounded text-[10px] font-bold text-pink-900">NEW</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </main>
                        </motion.div>
                    )}

                    {/* ===== CREATE/FORGE SCREEN (2.rtf) ===== */}
                    {activeScreen === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex-1 flex flex-col pt-12 pb-32"
                        >
                            <header className="px-6 pb-4 flex justify-between items-center z-10">
                                <div className="w-10 h-10 rounded-full bg-obsidian-card flex items-center justify-center border border-obsidian-border overflow-hidden">
                                    {context?.user?.pfpUrl ? (
                                        <img src={context.user.pfpUrl} alt="pfp" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-icons-round text-xl text-gray-500">account_circle</span>
                                    )}
                                </div>
                                <h1 className="text-lg font-bold text-white tracking-wide font-heading uppercase">Forge</h1>
                                <button className="w-10 h-10 rounded-full bg-obsidian-card flex items-center justify-center text-white border border-obsidian-border group">
                                    <Settings className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                </button>
                            </header>

                            <main className="px-6 flex-1 overflow-y-auto hide-scrollbar space-y-8">
                                <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-obsidian-border p-6 text-white shadow-lg mt-4">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <span className="inline-block px-3 py-1 bg-white/5 text-accent text-[10px] font-bold rounded-full mb-3 border border-white/10 backdrop-blur-md uppercase tracking-widest">AI Power</span>
                                        <h2 className="text-3xl font-bold leading-tight mb-2 font-heading">Forge Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Digital Persona</span></h2>
                                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">Transform your Farcaster identity into a unique, tradable memecoin asset instantly.</p>
                                        <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-transform active:scale-95 shadow-lg shadow-blue-900/20">
                                            <Sparkles size={20} />
                                            <span className="font-heading uppercase text-sm tracking-wide">Connect Farcaster</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-white font-bold font-heading">Target Network</h3>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Select one</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 8453, name: 'Base', icon: 'B', color: 'blue' },
                                            { id: 10, name: 'Optimism', icon: 'Op', color: 'red' },
                                            { id: 42161, name: 'Arbitrum', icon: 'Ar', color: 'cyan' },
                                            { id: 11142220, name: 'Celo', icon: 'Ce', color: 'green' }
                                        ].map(net => (
                                            <label key={net.id} className="cursor-pointer group relative">
                                                <input
                                                    type="radio"
                                                    name="network"
                                                    className="peer sr-only"
                                                    checked={selectedChain === net.id}
                                                    onChange={() => setSelectedChain(net.id)}
                                                />
                                                <div className="h-full p-4 rounded-xl bg-obsidian-card border border-obsidian-border peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:bg-obsidian-highlight">
                                                    <div className={`w-10 h-10 rounded-full bg-${net.color}-600 flex items-center justify-center mb-3 text-white font-bold shadow-lg`}>
                                                        {net.icon}
                                                    </div>
                                                    <span className="block text-white font-bold text-sm">{net.name}</span>
                                                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full border border-gray-600 peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-white font-bold font-heading mb-4">Trending Forges</h3>
                                    <div className="space-y-3">
                                        {memes.slice(0, 3).map((meme, i) => (
                                            <div key={i} className="flex items-center p-3 rounded-xl bg-obsidian-card border border-obsidian-border hover:border-gray-700 transition-colors">
                                                <div className="w-12 h-12 bg-zinc-800 rounded-lg mr-4 flex items-center justify-center overflow-hidden">
                                                    <Sparkles className="text-zinc-600 w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-bold text-sm font-display">{meme.name}</h4>
                                                    <p className="text-gray-500 text-[10px]">Forged recently</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-accent font-bold text-xs">+{Math.floor(Math.random() * 500)}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </main>

                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-obsidian-bg/80 backdrop-blur-md border-t border-white/5 z-20">
                                <button className="w-full bg-accent text-black font-bold text-lg py-4 rounded-2xl flex items-center justify-between px-6 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-accent/20 group">
                                    <span className="flex items-center font-heading">
                                        <Zap className="mr-2 animate-pulse-slow w-5 h-5 fill-current" />
                                        INITIATE FORGE
                                    </span>
                                    <ArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {/* ===== GALLERY SCREEN ===== */}
                    {activeScreen === 'gallery' && (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex-1 pb-32"
                        >
                            <header className="px-6 py-8">
                                <h1 className="text-3xl font-heading font-bold uppercase tracking-tight">Gallery</h1>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Discover new meme coins</p>
                            </header>

                            <main className="px-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {isLoadingMemes ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="aspect-square bg-obsidian-card rounded-2xl animate-pulse border border-obsidian-border" />
                                        ))
                                    ) : memes.length === 0 ? (
                                        <div className="col-span-2 text-center py-24 opacity-20 uppercase tracking-widest text-xs">No tokens forged yet</div>
                                    ) : (
                                        memes.map((meme) => (
                                            <TokenCard
                                                key={meme.token}
                                                name={meme.name}
                                                symbol={meme.symbol}
                                                curveAddress={meme.curve}
                                                onClick={() => setSelectedMeme(meme)}
                                            />
                                        ))
                                    )}
                                </div>
                            </main>
                        </motion.div>
                    )}

                    {/* ===== PROFILE SCREEN ===== */}
                    {(activeScreen === 'profile' || activeScreen === 'wallet') && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex-1 pb-32"
                        >
                            <header className="px-6 py-12 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-vibe-purple p-1 mb-6 shadow-2xl">
                                    <div className="w-full h-full rounded-full bg-obsidian-bg flex items-center justify-center overflow-hidden border border-white/10">
                                        {context?.user?.pfpUrl ? (
                                            <img src={context.user.pfpUrl} alt="pfp" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-icons-round text-5xl text-gray-700">account_circle</span>
                                        )}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">
                                    {context?.user?.displayName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Guest')}
                                </h2>
                                <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-2">Meme Forger Elite</p>
                            </header>

                            <main className="px-6 space-y-8">
                                <section>
                                    <h3 className="text-sm font-heading font-bold uppercase tracking-widest text-gray-500 mb-4 ml-2">My Forged Tokens</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {isLoadingMemes ? (
                                            <div className="col-span-2 text-center py-8 opacity-20 uppercase tracking-widest text-xs italic">Scanning blockchain...</div>
                                        ) : memes.filter(m => m.creator.toLowerCase() === address?.toLowerCase()).length === 0 ? (
                                            <div className="col-span-2 text-center py-16 bg-obsidian-card/50 rounded-3xl border border-obsidian-border border-dashed opacity-30 italic text-xs uppercase tracking-widest">You haven't forged anything yet</div>
                                        ) : (
                                            memes.filter(m => m.creator.toLowerCase() === address?.toLowerCase()).map((meme) => (
                                                <TokenCard
                                                    key={meme.token}
                                                    name={meme.name}
                                                    symbol={meme.symbol}
                                                    curveAddress={meme.curve}
                                                    onClick={() => setSelectedMeme(meme)}
                                                />
                                            ))
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-heading font-bold uppercase tracking-widest text-gray-500 mb-4 ml-2">Quick Access</h3>
                                    <div className="space-y-4">
                                        <button className="w-full bg-obsidian-card p-4 rounded-2xl flex items-center justify-between border border-obsidian-border hover:bg-obsidian-highlight transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <span className="material-icons-round">account_balance_wallet</span>
                                                </div>
                                                <span className="font-heading font-bold uppercase text-xs tracking-widest">Connect Wallet</span>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-600" />
                                        </button>
                                        <button className="w-full bg-obsidian-card p-4 rounded-2xl flex items-center justify-between border border-obsidian-border hover:bg-obsidian-highlight transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                    <span className="material-icons-round">history</span>
                                                </div>
                                                <span className="font-heading font-bold uppercase text-xs tracking-widest">Transaction History</span>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-600" />
                                        </button>
                                    </div>
                                </section>
                            </main>
                        </motion.div>
                    )}

                    {/* ===== SEARCH/FAVORITES PLACEHOLDER ===== */}
                    {(activeScreen === 'search' || activeScreen === 'favorites') && (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-obsidian-card rounded-3xl flex items-center justify-center border border-obsidian-border mb-6">
                                <Sparkles className="text-gray-700 w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-heading font-bold uppercase tracking-tight mb-2">Coming Soon</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">We're forging this feature in our AI foundry. Stay tuned!</p>
                            <button
                                onClick={() => setActiveScreen('home')}
                                className="mt-8 text-primary font-bold uppercase text-xs tracking-[0.2em] border-b border-primary/30 pb-1"
                            >
                                Back to Forge
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ===== TOKEN DETAIL OVERLAY ===== */}
                {selectedMeme && (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed inset-0 z-[100] bg-obsidian-bg overflow-y-auto pt-safe pb-safe"
                    >
                        <TokenDetail
                            token={selectedMeme as any}
                            onBack={() => setSelectedMeme(null)}
                        />
                    </motion.div>
                )}

                {/* ===== NAVIGATION (Visible on all except welcome) ===== */}
                {activeScreen !== 'welcome' && (
                    <Navbar
                        activeTab={
                            activeScreen === 'create' ? 'add' :
                                activeScreen === 'wallet' ? 'wallet' :
                                    activeScreen === 'profile' ? 'wallet' :
                                        activeScreen as any
                        }
                        onTabChange={(tab) => {
                            if (tab === 'add') setActiveScreen('create');
                            else if (tab === 'home') setActiveScreen('home');
                            else if (tab === 'wallet') setActiveScreen('profile');
                            else if (tab === 'search') setActiveScreen('gallery'); // Gallery as search for now
                            else setActiveScreen(tab as any);
                        }}
                    />
                )}
            </div>

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
}
