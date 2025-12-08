import { NextApiRequest, NextApiResponse } from 'next';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const GAIANET_API_URL = process.env.GAIANET_API_URL || 'https://llama.gaia.domains/v1';

// Fallback mock data when APIs are unavailable
const FALLBACK_IDEAS = [
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

async function fetchFarcasterProfile(fid: number) {
    if (!NEYNAR_API_KEY) {
        console.log('No Neynar API key, skipping profile fetch');
        return null;
    }

    try {
        // Fetch user profile
        const userRes = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
            headers: { 'api_key': NEYNAR_API_KEY }
        });

        if (!userRes.ok) {
            console.error('Neynar user fetch failed:', userRes.status);
            return null;
        }

        const userData = await userRes.json();
        const user = userData.users?.[0];

        if (!user) return null;

        // Fetch recent casts
        const castsRes = await fetch(`https://api.neynar.com/v2/farcaster/feed/user/${fid}/casts?limit=5`, {
            headers: { 'api_key': NEYNAR_API_KEY }
        });

        let recentCasts: string[] = [];
        if (castsRes.ok) {
            const castsData = await castsRes.json();
            recentCasts = castsData.casts?.map((c: any) => c.text).filter(Boolean) || [];
        }

        return {
            fid: user.fid,
            username: user.username,
            displayName: user.display_name,
            bio: user.profile?.bio?.text || '',
            followers: user.follower_count || 0,
            following: user.following_count || 0,
            pfpUrl: user.pfp_url,
            recentCasts
        };
    } catch (error) {
        console.error('Error fetching Farcaster profile:', error);
        return null;
    }
}

async function generateWithGaiaNet(profileData: any, prompt?: string) {
    const SYSTEM_PROMPT = `You are a creative meme coin generator for MemeSmith AI. Create unique, personalized meme coin concepts.

Respond with a JSON object containing:
- name: A catchy name (2-3 words max)
- symbol: Trading symbol (3-5 uppercase letters)
- description: A witty description (1-2 sentences)
- logoPrompt: A detailed prompt for generating a logo image

Rules: Be creative, humorous, reference crypto culture, make it personalized.
Respond ONLY with valid JSON.`;

    let userMessage = prompt || "Create a fun meme coin for a crypto enthusiast";

    if (profileData) {
        userMessage = `Create a meme coin for this Farcaster user:
Username: @${profileData.username}
Display Name: ${profileData.displayName}
Bio: ${profileData.bio || 'No bio'}
Followers: ${profileData.followers}
Recent Casts: ${profileData.recentCasts?.slice(0, 3).join(' | ') || 'None'}

Make the coin reflect their personality, interests, and online presence.`;
    }

    const response = await fetch(`${GAIANET_API_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        throw new Error(`GaiaNet error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error('No AI response');

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    return JSON.parse(jsonMatch[0]);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { fid, prompt } = req.body;

        // Try to fetch Farcaster profile if FID is provided
        let profileData: Awaited<ReturnType<typeof fetchFarcasterProfile>> = null;
        if (fid) {
            profileData = await fetchFarcasterProfile(fid);
        }

        // Try AI generation
        try {
            const idea = await generateWithGaiaNet(profileData, prompt);

            // Validate response structure
            if (idea.name && idea.symbol && idea.description && idea.logoPrompt) {
                return res.status(200).json(idea);
            }
        } catch (aiError) {
            console.error('AI generation failed, using fallback:', aiError);
        }

        // Fallback to mock data
        const fallbackIndex = fid ? fid % FALLBACK_IDEAS.length : Math.floor(Math.random() * FALLBACK_IDEAS.length);
        return res.status(200).json(FALLBACK_IDEAS[fallbackIndex]);

    } catch (error: any) {
        console.error('Error in analyze-profile:', error);
        return res.status(500).json({ error: error.message || 'Failed to analyze profile' });
    }
}
