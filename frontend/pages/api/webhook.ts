// pages/api/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Webhook signature verification would go here
        // For now, accepting all requests (add proper verification in production)

        // You can add any custom logic here (e.g., analytics, logging)
        console.log('Webhook received:', req.body);

        return res.status(200).json({ ok: true });
    } catch (e: any) {
        console.error('Webhook error:', e);
        return res.status(500).json({ error: e.message ?? 'Server error' });
    }
}
