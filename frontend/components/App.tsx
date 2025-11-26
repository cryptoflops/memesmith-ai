'use client';

import { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { useAccount } from 'wagmi';
import { useMemeFactory } from '../hooks/useMemeFactory';

type MemeIdea = {
    name: string;
    symbol: string;
    description: string;
    logoPrompt: string;
};

export default function App() {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<any | undefined>();
    const [step, setStep] = useState<'auth' | 'analyze' | 'review' | 'art' | 'deploy' | 'success'>('auth');
    // Using context?.client?.safeAreaInsets; removed duplicate state

    // AI State
    const [idea, setIdea] = useState<MemeIdea | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Chain State - Celo Sepolia chain ID
    const [selectedChain, setSelectedChain] = useState<number>(11142220); // Celo Sepolia
    const { launchMemeFromIdea } = useMemeFactory();
    const { isConnected } = useAccount();
    const [txHash, setTxHash] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const ctx = await sdk.context;
            setContext(ctx);
            // Retrieve safe area insets from the SDK (if available)
            // Removed SDK getSafeAreaInsets call; using context?.client?.safeAreaInsets instead
            sdk.actions.ready();
        };
        if (sdk && !isSDKLoaded) {
            setIsSDKLoaded(true);
            load();
        }
    }, [isSDKLoaded]);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/analyze-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fid: context?.user?.fid,
                    // If no FID (local dev), use a prompt
                    prompt: !context?.user?.fid ? "Create a meme coin for a crypto developer" : undefined
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setIdea(data);
            setStep('review');
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
            setStep('deploy');
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
            setStep('success');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isSDKLoaded) return <div className="flex items-center justify-center h-screen">Loading Farcaster SDK...</div>;

    const safeAreaInsets = context?.client?.safeAreaInsets;

    return (
        <div className="min-h-screen bg-black text-white font-mono p-4" style={{
            paddingTop: safeAreaInsets?.top ? `${safeAreaInsets.top}px` : '1rem',
            paddingBottom: safeAreaInsets?.bottom ? `${safeAreaInsets.bottom}px` : '1rem',
            paddingLeft: safeAreaInsets?.left ? `${safeAreaInsets.left}px` : '1rem',
            paddingRight: safeAreaInsets?.right ? `${safeAreaInsets.right}px` : '1rem',
        }}>
            <div className="max-w-md mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-green to-cyan-400 bg-clip-text text-transparent animate-pulse">
                        MEMESMITH AI
                    </h1>
                    <p className="text-gray-400 text-sm">FORGE YOUR SOCIAL IDENTITY</p>
                </header>

                <main>
                    {step === 'auth' && (
                        <div className="text-center space-y-6">
                            <div className="p-6 border border-neon-green/30 rounded-lg bg-gray-900/50 backdrop-blur">
                                <p className="text-lg mb-4">
                                    Ready create your own profile coin?
                                </p>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-neon-green text-black font-bold rounded hover:bg-green-400 transition-all transform hover:scale-105"
                                >
                                    {isLoading ? 'ANALYZING PROFILE...' : 'FORGE MY COIN'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'review' && idea && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="p-6 border border-neon-green rounded-lg bg-gray-900">
                                <h2 className="text-2xl font-bold text-neon-green mb-2">{idea.name}</h2>
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="px-3 py-1 bg-neon-green text-black font-bold rounded text-sm">
                                        ${idea.symbol}
                                    </span>
                                </div>
                                <p className="text-gray-300 italic">"{idea.description}"</p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setStep('auth')}
                                    className="flex-1 py-3 border border-gray-600 rounded hover:bg-gray-800"
                                >
                                    REGENERATE
                                </button>
                                <button
                                    onClick={handleGenerateArt}
                                    disabled={isLoading}
                                    className="flex-1 py-3 bg-neon-green text-black font-bold rounded hover:bg-green-400"
                                >
                                    {isLoading ? 'GENERATING...' : 'GENERATE LOGO'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'art' && imageUrl && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-neon-green shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                                <img src={imageUrl} alt="Token Logo" className="w-full h-full object-cover" />
                            </div>
                            <button
                                onClick={() => setStep('deploy')}
                                className="w-full py-4 bg-neon-green text-black font-bold rounded hover:bg-green-400"
                            >
                                PROCEED TO DEPLOYMENT
                            </button>
                        </div>
                    )}

                    {step === 'deploy' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                                <h3 className="text-lg font-bold mb-4 text-gray-300">Select Network</h3>
                                <select
                                    value={selectedChain}
                                    onChange={(e) => setSelectedChain(Number(e.target.value))}
                                    className="w-full p-3 bg-black border border-gray-600 rounded text-white mb-4"
                                >
                                    <option value={11142220}>Celo Sepolia</option>
                                    <option value={84532}>Base Sepolia</option>
                                    <option value={11155420}>Optimism Sepolia</option>
                                    <option value={421614}>Arbitrum Sepolia</option>
                                </select>
                            </div>

                            {!isConnected ? (
                                <appkit-button />
                            ) : (
                                <button
                                    onClick={handleDeploy}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-neon-green text-black font-bold rounded hover:bg-green-400"
                                >
                                    {isLoading ? 'Deploying...' : `DEPLOY TOKEN (0.5 ETH/CELO)`}
                                </button>
                            )}
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center space-y-6 animate-fade-in">
                            <div className="text-6xl">🎉</div>
                            <h2 className="text-3xl font-bold text-neon-green">Token Deployed!</h2>
                            <div className="p-4 bg-gray-900 rounded break-all font-mono text-xs border border-gray-700">
                                Tx: {txHash}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => sdk.actions.openUrl(`https://sepolia.celoscan.io/tx/${txHash}`)}
                                    className="py-3 bg-gray-800 rounded hover:bg-gray-700"
                                >
                                    View on Explorer
                                </button>
                                <button
                                    onClick={() => sdk.actions.composeCast({
                                        text: `I just forged $${idea?.symbol} on MemeSmith AI! ⚒️\n\nCheck it out:`,
                                        embeds: [`https://sepolia.celoscan.io/tx/${txHash}`]
                                    })}
                                    className="py-3 bg-purple-600 text-white rounded hover:bg-purple-500"
                                >
                                    Share on Farcaster
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                            {error}
                        </div>
                    )}
                </main>

                <footer className="text-center text-xs text-gray-600 pt-8 space-y-4">
                    <p>Powered by GaiaNet & Celo</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => sdk.actions.addMiniApp()}
                            className="text-neon-green hover:underline"
                        >
                            Add to Home
                        </button>
                        <button
                            onClick={() => sdk.actions.close()}
                            className="text-gray-500 hover:text-white"
                        >
                            Close
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
