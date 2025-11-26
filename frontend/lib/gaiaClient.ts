// frontend/lib/gaiaClient.ts
export type MemeIdea = {
  name: string;
  symbol: string;
  description: string;
  logoPrompt: string;
};

export async function generateMemeIdea(userPrompt: string): Promise<MemeIdea> {
  const res = await fetch('/api/gaia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userPrompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `API error ${res.status}`);
  }

  return (await res.json()) as MemeIdea;
}
