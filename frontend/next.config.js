/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['openai'],
    },
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');

        // Add fallbacks for React Native modules that MetaMask SDK tries to import
        config.resolve.fallback = {
            ...config.resolve.fallback,
            '@react-native-async-storage/async-storage': false,
            'react-native': false,
        };

        return config;
    },
};

module.exports = nextConfig;
