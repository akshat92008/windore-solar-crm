import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

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
{
  "score": <number between 1-100>,
  "tier": "<'Hot' | 'Warm' | 'Cold'>",
  "reasoning": "<1-2 sentence explanation of the score>",
  "recommendedAction": "<specific next step the sales rep should take>"
}

Scoring Guide:
- $200+/month bill: Score 80-100 (Hot)
- $100-199/month bill: Score 50-79 (Warm)
- Under $100/month bill: Score 20-49 (Cold)
- Adjust score up if they are further along in the sales process (Contacted or Proposal Sent).`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
    });

    const text = response.text ?? '{}';
    // Strip potential markdown fences
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned) as LeadAIResult;
    return parsed;
}
