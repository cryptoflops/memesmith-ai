import { NextApiRequest, NextApiResponse } from 'next';

const GAIANET_API_URL = process.env.GAIANET_API_URL || 'https://llama.gaia.domains/v1';

const SYSTEM_PROMPT = `You are a creative meme coin generator for the MemeSmith AI platform. Your job is to analyze user profiles and create unique, personalized meme coin concepts.

When given a user prompt or profile information, you must respond with a JSON object containing:
- name: A catchy, memorable name for the meme coin (2-3 words max)
- symbol: A trading symbol (3-5 uppercase letters)
- description: A witty, engaging description (1-2 sentences)
- logoPrompt: A detailed prompt for generating a logo image (describe visual elements, style, colors)

Rules:
1. Be creative and humorous but not offensive
2. Reference crypto/web3 culture when appropriate
3. Make it feel personalized to the input
4. Keep names punchy and memorable
5. Symbols should be unique and pronounceable

Respond ONLY with valid JSON, no additional text.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, profileData } = req.body;

        if (!prompt && !profileData) {
            return res.status(400).json({ error: 'Prompt or profileData is required' });
        }

        // Build the user message from profile data or direct prompt
        let userMessage = prompt;
        if (profileData) {
            userMessage = `Create a meme coin for this Farcaster user:
Username: ${profileData.username || 'unknown'}
Display Name: ${profileData.displayName || 'Anonymous'}
Bio: ${profileData.bio || 'No bio'}
Followers: ${profileData.followers || 0}
Recent Casts: ${profileData.recentCasts?.slice(0, 3).join(' | ') || 'None'}

Make the coin reflect their personality and interests.`;
        }

        const response = await fetch(`${GAIANET_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.8,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GaiaNet API error:', errorText);
            throw new Error(`GaiaNet API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error('No response from AI');
        }

        // Parse the JSON response
        let memeIdea;
        try {
            // Try to extract JSON from the response (handle markdown code blocks)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                memeIdea = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('Failed to parse AI response:', content);
            // Fallback to a generated response
            memeIdea = {
                name: "GigaChad Coin",
                symbol: "GIGA",
                description: "For the absolute legends of the crypto space",
                logoPrompt: "A muscular golden Shiba Inu wearing sunglasses, crypto symbols floating around, vaporwave aesthetic"
            };
        }

        // Validate required fields
        if (!memeIdea.name || !memeIdea.symbol || !memeIdea.description || !memeIdea.logoPrompt) {
            throw new Error('Invalid AI response structure');
        }

        return res.status(200).json(memeIdea);
    } catch (error: any) {
        console.error('Error in gaia API:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate meme idea' });
    }
}
