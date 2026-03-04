export interface LeadAIResult {
    score: number; // 1-100
    tier: 'Hot' | 'Warm' | 'Cold';
    reasoning: string;
    recommendedAction: string;
}

/**
 * Calls the Gemini REST API directly via fetch (browser-safe, no SDK CORS issues).
 * Returns a structured lead score, tier, reasoning, and recommended action.
 */
export async function scoreLeadWithAI(
    name: string,
    monthlyBill: number,
    status: string
): Promise<LeadAIResult> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

    if (!apiKey) {
        throw new Error('VITE_GEMINI_API_KEY is not set');
    }

    const prompt = `You are a solar sales expert AI. Score this solar lead and respond ONLY with a JSON object, no other text.

Lead:
- Name: ${name}
- Monthly Bill: $${monthlyBill}
- CRM Status: ${status}

Rules:
- $200+: score 80-100, tier "Hot"
- $100-199: score 50-79, tier "Warm"  
- Under $100: score 20-49, tier "Cold"
- Boost score by 5-10 if status is Contacted or Proposal Sent

Respond with only this JSON (no markdown):
{"score":75,"tier":"Warm","reasoning":"One sentence explanation.","recommendedAction":"One specific next step."}`;

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 256 },
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any)?.error?.message ?? `HTTP ${res.status}`);
    }

    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!text) throw new Error('Empty response from Gemini');

    // Extract JSON object — strips any accidental markdown fences
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in Gemini response');

    const parsed = JSON.parse(jsonMatch[0]) as LeadAIResult;

    if (typeof parsed.score !== 'number' || !parsed.tier) {
        throw new Error('Invalid AI response structure');
    }

    return parsed;
}
