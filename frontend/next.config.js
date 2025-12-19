/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['openai'],
    },
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    async redirects() {
        return [
            {
                source: '/.well-known/farcaster.json',
                destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/019b04ab-e413-183c-8ae0-45648d0d9c81',
                permanent: false, // 307 temporary redirect
            },
        ];
    },
    async headers() {
        return [
            {
                // Allow Farcaster to embed this app in an iframe
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'ALLOWALL',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'self' https://warpcast.com https://*.warpcast.com https://farcaster.xyz https://*.farcaster.xyz",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
