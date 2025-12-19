'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMemeFactory } from '../hooks/useMemeFactory';
import { useMemes } from '../hooks/useMemes';
import { BottomNav } from './BottomNav';
import { StatCard } from './StatCard';
import { TokenCard } from './TokenCard';
import { ActionCard } from './ActionCard';
import { FilterChips } from './FilterChips';
import { TokenDetail } from './TokenDetail';
import { AuroraBackground } from './AuroraBackground';
import { MemeMetadata } from '../hooks/useMemes';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, PlusSquare, User, TrendingUp, Zap, Sparkles } from 'lucide-react';

type MemeIdea = {
    name: string;
    symbol: string;
    description: string;
    logoPrompt: string;
};

type Screen = 'home' | 'create' | 'gallery' | 'profile';

export default function App() {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<any | undefined>();
    const [activeScreen, setActiveScreen] = useState<Screen>('home');
    const [createStep, setCreateStep] = useState<'start' | 'review' | 'art' | 'deploy' | 'success'>('start');
    const [selectedMeme, setSelectedMeme] = useState<MemeMetadata | null>(null);

    // AI State
    const [idea, setIdea] = useState<MemeIdea | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Chain State
    const [selectedChain, setSelectedChain] = useState<number>(11142220); // Default to Celo Sepolia
    const { launchMemeFromIdea } = useMemeFactory(selectedChain);
    const { memes, isLoading: isLoadingMemes, count } = useMemes(selectedChain);
    const { isConnected, address } = useAccount();
    const [txHash, setTxHash] = useState<string | null>(null);

    // Gallery filters
    const [activeFilter, setActiveFilter] = useState('Trending');
    const filterOptions = ['Trending', 'New', 'My Coins'];

    // SDK reference for actions
    const [sdk, setSdk] = useState<any>(null);

    // Initialize Farcaster SDK on mount with dynamic import
    useEffect(() => {
        const initFarcaster = async () => {
            try {
                // Dynamic import - only runs on client
                const farcasterSdk = await import('@farcaster/miniapp-sdk');
                const sdkInstance = farcasterSdk.default || farcasterSdk;
                setSdk(sdkInstance);

                console.log('[MemeSmith] SDK imported successfully');

                // Get context
                try {
                    const ctx = await sdkInstance.context;
                    setContext(ctx);
                    console.log('[MemeSmith] Context:', ctx);
                } catch (e) {
                    console.log('[MemeSmith] No context available');
                }

                // Call ready() to dismiss splash screen
                if (sdkInstance.actions && sdkInstance.actions.ready) {
                    sdkInstance.actions.ready();
                    console.log('[MemeSmith] ready() called');
                }

                setIsSDKLoaded(true);
            } catch (e) {
                console.error('[MemeSmith] SDK init failed:', e);
                setIsSDKLoaded(true); // Still render app
            }
        };

        initFarcaster();
    }, []);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/analyze-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fid: context?.user?.fid,
                    prompt: !context?.user?.fid ? "Create a meme coin for a crypto developer" : undefined
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setIdea(data);
            setCreateStep('review');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateArt = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/generate-asset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: idea?.logoPrompt }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setImageUrl(data.imageUrl);
            setCreateStep('deploy');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeploy = async () => {
        if (!idea) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await launchMemeFromIdea(idea, selectedChain);
            setTxHash(result?.hash || null);
            setCreateStep('success');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getExplorerUrl = (hash: string) => {
        switch (selectedChain) {
            case 42220: return `https://celoscan.io/tx/${hash}`;
            case 8453: return `https://basescan.org/tx/${hash}`;
            case 10: return `https://optimistic.etherscan.io/tx/${hash}`;
            case 42161: return `https://arbiscan.io/tx/${hash}`;
            default: return `https://celoscan.io/tx/${hash}`;
        }
    };

    const getChainName = (chainId: number) => {
        switch (chainId) {
            case 42220: return 'Celo';
            case 8453: return 'Base';
            case 10: return 'Optimism';
            case 42161: return 'Arbitrum';
            default: return 'Chain';
        }
    };

    if (!isSDKLoaded) {
        return (
            <div className="safe-container flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4 animate-pulse">⚡</div>
                    <p className="text-label">Loading MemeSmith AI...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen relative overflow-x-hidden">
            <AuroraBackground />

            <div className="safe-container">
                <AnimatePresence mode="wait">
                    {/* ===== HOME SCREEN ===== */}
                    {activeScreen === 'home' && !selectedMeme && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            <header className="py-6 flex justify-between items-center">
                                <div>
                                    <h1 className="text-display text-4xl mb-1">MemeSmith</h1>
                                    <p className="text-sm opacity-50 font-medium tracking-wide uppercase">Forge Your Identity</p>
                                </div>
                                <div className="glass-card p-2 px-4 flex items-center gap-2">
                                    <Sparkles size={16} className="text-neon-yellow" />
                                    <span className="text-xs font-bold tracking-tighter">AI READY</span>
                                </div>
                            </header>

                            <section className="grid grid-cols-2 gap-4">
                                <StatCard
                                    icon={<TrendingUp size={20} />}
                                    label="Coins Created"
                                    value={count.toString()}
                                    color="yellow"
                                />
                                <StatCard
                                    icon={<Zap size={20} />}
                                    label="Network"
                                    value="Celo"
                                    color="green"
                                />
                            </section>

                            <section>
                                <div className="flex justify-between items-end mb-4">
                                    <h2 className="text-title text-xl">Quick Actions</h2>
                                </div>
                                <div className="grid gap-4">
                                    <ActionCard
                                        icon={<PlusSquare />}
                                        title="Create Meme"
                                        description="AI analysis from your profile"
                                        color="yellow"
                                        onClick={() => setActiveScreen('create')}
                                    />
                                    <ActionCard
                                        icon={<LayoutGrid />}
                                        title="Browse Gallery"
                                        description="Latest tokens on Celo"
                                        color="green"
                                        onClick={() => setActiveScreen('gallery')}
                                    />
                                </div>
                            </section>

                            <section>
                                <div className="flex justify-between items-end mb-4">
                                    <h2 className="text-title text-xl">Trending Forge</h2>
                                    <button
                                        className="text-xs font-bold text-neon-yellow uppercase tracking-widest"
                                        onClick={() => setActiveScreen('gallery')}
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {isLoadingMemes ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="aspect-square glass-card animate-pulse" />
                                        ))
                                    ) : memes.length === 0 ? (
                                        <div className="col-span-2 text-center py-12 glass-card opacity-30">No tokens forged yet</div>
                                    ) : (
                                        memes.slice(0, 4).map((meme) => (
                                            <TokenCard
                                                key={meme.token}
                                                name={meme.name}
                                                symbol={meme.symbol}
                                                curveAddress={meme.curve}
                                                onClick={() => {
                                                    setSelectedMeme(meme);
                                                }}
                                            />
                                        ))
                                    )}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {/* ===== TOKEN DETAIL OVERLAY ===== */}
                    {selectedMeme && (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed inset-0 z-[110] bg-black/95 safe-container overflow-y-auto"
                        >
                            <TokenDetail
                                token={selectedMeme}
                                onBack={() => setSelectedMeme(null)}
                            />
                        </motion.div>
                    )}

                    {/* ===== GALLERY SCREEN ===== */}
                    {activeScreen === 'gallery' && !selectedMeme && (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <header className="py-6">
                                <h1 className="text-display text-4xl">Gallery</h1>
                                <p className="text-sm opacity-50 font-medium tracking-wide uppercase">All forged memecoins</p>
                            </header>

                            <FilterChips
                                options={filterOptions}
                                activeOption={activeFilter}
                                onChange={setActiveFilter}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                {isLoadingMemes ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="aspect-square glass-card animate-pulse" />
                                    ))
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
                        </motion.div>
                    )}

                    {/* ===== PROFILE SCREEN ===== */}
                    {activeScreen === 'profile' && !selectedMeme && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="space-y-8"
                        >
                            <div className="text-center py-12 glass-card">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-tr from-neon-purple to-neon-blue p-1">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                        <User size={48} className="text-white opacity-50" />
                                    </div>
                                </div>
                                <h2 className="text-display text-2xl truncate px-4">
                                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
                                </h2>
                                <p className="text-xs text-neon-yellow font-bold uppercase tracking-widest mt-2">{address ? 'Meme Forger' : 'Connect Wallet'}</p>
                            </div>

                            <section>
                                <h3 className="text-title text-lg mb-4 ml-2">My Forged Tokens</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {isLoadingMemes ? (
                                        <div className="col-span-2 text-center py-8 opacity-50">Loading forge...</div>
                                    ) : memes.filter(m => m.creator.toLowerCase() === address?.toLowerCase()).length === 0 ? (
                                        <div className="col-span-2 text-center py-12 glass-card opacity-30 italic">You haven't forged anything yet</div>
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ===== BOTTOM NAVIGATION ===== */}
            <nav className="bottom-nav">
                <button
                    className={`nav-item ${activeScreen === 'home' && !selectedMeme ? 'active' : ''}`}
                    onClick={() => { setActiveScreen('home'); setSelectedMeme(null); }}
                >
                    <PlusSquare size={24} />
                </button>
                <button
                    className={`nav-item ${activeScreen === 'gallery' && !selectedMeme ? 'active' : ''}`}
                    onClick={() => { setActiveScreen('gallery'); setSelectedMeme(null); }}
                >
                    <LayoutGrid size={24} />
                </button>
                <button
                    className={`nav-item ${activeScreen === 'profile' && !selectedMeme ? 'active' : ''}`}
                    onClick={() => { setActiveScreen('profile'); setSelectedMeme(null); }}
                >
                    <User size={24} />
                </button>
            </nav>
        </main>
    );
}
