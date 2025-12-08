import { NextApiRequest, NextApiResponse } from 'next';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0';

// Placeholder fallback when API is unavailable
const PLACEHOLDER_URL = 'https://via.placeholder.com/1024x1024/6366f1/ffffff?text=Meme+Coin+Logo';

async function generateWithHuggingFace(prompt: string): Promise<string> {
    if (!HUGGINGFACE_API_KEY) {
        throw new Error('No Hugging Face API key');
    }

    // Enhance the prompt for better results
    const enhancedPrompt = `${prompt}, high quality, digital art, vibrant colors, detailed, professional logo design, centered composition, clean background`;

    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: enhancedPrompt,
            parameters: {
                negative_prompt: 'blurry, low quality, distorted, ugly, text, watermark',
                num_inference_steps: 30,
                guidance_scale: 7.5,
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Hugging Face error:', errorText);

        // Check if model is loading
        if (response.status === 503) {
            throw new Error('Model is loading, please try again in a moment');
        }
        throw new Error(`Image generation failed: ${response.status}`);
    }

    // Response is the image blob
    const imageBlob = await response.blob();

    // Convert to base64 data URL
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = 'image/png';

    return `data:${mimeType};base64,${base64}`;
}

// Alternative: Use a free API like Pollinations.ai
async function generateWithPollinations(prompt: string): Promise<string> {
    const enhancedPrompt = encodeURIComponent(`${prompt}, high quality digital art, vibrant colors, professional logo`);
    // Pollinations.ai is free and doesn't require API key
    return `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=512&height=512&nologo=true`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Try Hugging Face first
        if (HUGGINGFACE_API_KEY) {
            try {
                const imageUrl = await generateWithHuggingFace(prompt);
                return res.status(200).json({ imageUrl });
            } catch (hfError: any) {
                console.error('Hugging Face generation failed:', hfError.message);
            }
        }

        // Fallback to Pollinations.ai (free, no API key needed)
        try {
            const imageUrl = await generateWithPollinations(prompt);
            return res.status(200).json({ imageUrl });
        } catch (polError) {
            console.error('Pollinations generation failed:', polError);
        }

        // Final fallback to placeholder
        return res.status(200).json({ imageUrl: PLACEHOLDER_URL });

    } catch (error: any) {
        console.error('Error in generate-asset:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate asset' });
    }
}
