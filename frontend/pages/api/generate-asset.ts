import { NextApiRequest, NextApiResponse } from 'next';

// Free image generation options (no API key required)
const FREE_MODELS = [
    'https://stabilityai-stable-diffusion-3-5-large-turbo.hf.space/api/predict',
    'https://prodia-sdxl-stable-diffusion-xl.hf.space/api/predict',
];

// Hugging Face Inference API (requires API key) 
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Generate using Hugging Face Spaces (FREE, no API key)
async function generateWithHFSpaces(prompt: string): Promise<string> {
    const enhancedPrompt = `${prompt}, high quality, digital art, vibrant colors, meme coin logo, centered, clean background`;

    // Try Prodia SDXL Space (free)
    const response = await fetch('https://prodia-sdxl-stable-diffusion-xl.hf.space/run/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: [
                enhancedPrompt,                    // prompt
                "blurry, low quality, distorted, ugly, text, watermark", // negative
                "DPM++ 2M Karras",                 // sampler
                20,                                // steps
                7,                                 // cfg scale
                512,                               // width
                512,                               // height
                -1,                                // seed
            ]
        }),
    });

    if (!response.ok) {
        throw new Error(`HF Spaces error: ${response.status}`);
    }

    const result = await response.json();

    // Prodia returns the image URL in data[0]
    if (result.data && result.data[0]) {
        return result.data[0];
    }

    throw new Error('No image URL in response');
}

// Generate using Hugging Face Inference API (requires API key)
async function generateWithHuggingFace(prompt: string): Promise<string> {
    if (!HUGGINGFACE_API_KEY) {
        throw new Error('No Hugging Face API key');
    }

    const enhancedPrompt = `${prompt}, high quality, digital art, vibrant colors, detailed, professional logo design, centered composition, clean background`;

    const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: enhancedPrompt,
            parameters: {
                negative_prompt: 'blurry, low quality, distorted, ugly, text, watermark',
                num_inference_steps: 25,
                guidance_scale: 7.5,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`HF API error: ${response.status}`);
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return `data:image/png;base64,${base64}`;
}

// Pollinations.ai - 100% free, no API key
async function generateWithPollinations(prompt: string): Promise<string> {
    const enhancedPrompt = encodeURIComponent(`${prompt}, high quality digital art, vibrant colors, professional meme coin logo, centered`);
    // Direct URL that redirects to generated image
    return `https://image.pollinations.ai/prompt/${enhancedPrompt}?width=512&height=512&nologo=true&seed=${Date.now()}`;
}

// Picsum for development/testing placeholder
function getPlaceholder(): string {
    return `https://picsum.photos/seed/${Date.now()}/512/512`;
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

        console.log('Generating image for prompt:', prompt);

        // Priority 1: Use Hugging Face API if key is provided
        if (HUGGINGFACE_API_KEY) {
            try {
                console.log('Trying Hugging Face Inference API...');
                const imageUrl = await generateWithHuggingFace(prompt);
                console.log('HF API success');
                return res.status(200).json({ imageUrl, source: 'huggingface-api' });
            } catch (error: any) {
                console.log('HF API failed:', error.message);
            }
        }

        // Priority 2: Try Hugging Face Spaces (free)
        try {
            console.log('Trying Hugging Face Spaces...');
            const imageUrl = await generateWithHFSpaces(prompt);
            console.log('HF Spaces success');
            return res.status(200).json({ imageUrl, source: 'huggingface-spaces' });
        } catch (error: any) {
            console.log('HF Spaces failed:', error.message);
        }

        // Priority 3: Pollinations.ai (free, reliable)
        try {
            console.log('Using Pollinations.ai...');
            const imageUrl = await generateWithPollinations(prompt);
            console.log('Pollinations success');
            return res.status(200).json({ imageUrl, source: 'pollinations' });
        } catch (error: any) {
            console.log('Pollinations failed:', error.message);
        }

        // Final fallback: placeholder
        console.log('Using placeholder');
        return res.status(200).json({
            imageUrl: getPlaceholder(),
            source: 'placeholder'
        });

    } catch (error: any) {
        console.error('Error in generate-asset:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate asset' });
    }
}
