import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { fid } = req.body;

        // Mock data for testing - no API calls needed
        const mockIdeas = [
            {
                name: "DegenDev",
                symbol: "DDEV",
                description: "For the fearless builders who ship code at 3 AM and debug on mainnet",
                logoPrompt: "A cyberpunk hacker cat wearing VR goggles, neon green and purple colors, digital art style"
            },
            {
                name: "GigaBrain",
                symbol: "BRAIN",
                description: "The coin for galaxy-brain takes and 200 IQ plays in the crypto markets",
                logoPrompt: "A glowing brain made of circuit boards and lightning, futuristic sci-fi style"
            },
            {
                name: "MoonBoi",
                symbol: "MOON",
                description: "To the moon and beyond! For eternal optimists and chart watchers",
                logoPrompt: "A cute astronaut riding a rocket to the moon, cartoon style with bright colors"
            }
        ];

        // Return a random idea or based on FID
        const idea = fid ? mockIdeas[fid % mockIdeas.length] : mockIdeas[0];

        return res.status(200).json(idea);
    } catch (error: any) {
        console.error('Error in analyze-profile:', error);
        return res.status(500).json({ error: error.message || 'Failed to analyze profile' });
    }
}
