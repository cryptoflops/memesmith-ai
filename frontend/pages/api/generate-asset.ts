import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Use a placeholder image service instead of DALL-E
        // You can replace this with any free image generation API later
        const imageUrl = `https://via.placeholder.com/1024x1024/6366f1/ffffff?text=${encodeURIComponent('Meme Coin Logo')}`;

        return res.status(200).json({ imageUrl });
    } catch (error: any) {
        console.error('Error in generate-asset:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate asset' });
    }
}
