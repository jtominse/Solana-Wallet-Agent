import { callLLM } from "../utils/llm.js";

const SYSTEM_PROMPT = `You are a DeFi risk assessment engine.
Given event classification and wallet profile data, compute a risk/opportunity score.
Always respond with valid JSON only. No markdown, no explanation.`;

/**
 * Agent 3: Score risk and opportunity level
 * Output: { score, level, signals, opportunityType }
 */
export async function scoreRisk({ classification, walletProfile }) {
  const prompt = `
Assess the risk and opportunity level of this on-chain activity.

Event Classification:
${JSON.stringify(classification, null, 2)}

Wallet Profile:
${JSON.stringify(walletProfile, null, 2)}

Return JSON with this exact schema:
{
  "score": number,             // 0-100, higher = more actionable/risky
  "level": string,             // "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  "signals": string[],         // key signals driving the score
  "opportunityType": string,   // "RUG_RISK" | "WHALE_ACCUMULATION" | "ARB_WINDOW" | "NONE" | "UNKNOWN"
  "timeToAct": string,         // "IMMEDIATE" | "WITHIN_1H" | "MONITOR" | "NONE"
  "reasoning": string          // short reasoning chain for the score
}`;

  const response = await callLLM(SYSTEM_PROMPT, prompt);
  return JSON.parse(response);
}
