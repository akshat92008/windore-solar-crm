import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string });

export interface LeadAIResult {
    score: number; // 1-100
    tier: 'Hot' | 'Warm' | 'Cold';
    reasoning: string;
    recommendedAction: string;
}

/**
 * Uses Gemini Flash to score a solar lead based on their monthly bill.
 * Returns a numeric score, tier, reasoning, and a recommended next action.
 */
export async function scoreLeadWithAI(
    name: string,
    monthlyBill: number,
    status: string
): Promise<LeadAIResult> {
    const prompt = `You are a solar sales expert AI assistant. Analyze this solar lead and provide a JSON-formatted lead score.

Lead Data:
- Name: ${name}
- Monthly Electricity Bill: $${monthlyBill}
- Current CRM Status: ${status}

Based on this data, provide a structured assessment. A higher monthly bill means higher solar savings potential and should result in a higher score.

Return ONLY a valid JSON object (no markdown, no extra text) in this exact format:
{"score":75,"tier":"Warm","reasoning":"This lead has a moderate bill and is worth pursuing.","recommendedAction":"Call within 24 hours to discuss savings potential."}

Scoring Guide:
- $200+/month bill: Score 80-100 (Hot)
- $100-199/month bill: Score 50-79 (Warm)
- Under $100/month bill: Score 20-49 (Cold)
- Adjust score up if they are further along: Contacted +5, Proposal Sent +10`;

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
    });

    const text = response.text ?? '';

    if (!text) {
        throw new Error('Empty response from Gemini');
    }

    // Strip potential markdown fences and pull out the JSON object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as LeadAIResult;

    // Validate required fields
    if (typeof parsed.score !== 'number' || !parsed.tier || !parsed.reasoning) {
        throw new Error('Invalid AI response structure');
    }

    return parsed;
}
