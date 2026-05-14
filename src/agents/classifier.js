import { callLLM } from "../utils/llm.js";

const SYSTEM_PROMPT = `You are a Solana on-chain event classifier. 
Analyze raw transaction data and classify it.
Always respond with valid JSON only. No markdown, no explanation.`;

/**
 * Agent 1: Classify the raw Helius webhook event
 * Output: { relevant, type, primaryWallet, tokens, amountUsd, confidence }
 */
export async function classifyEvent(rawEvent) {
  const prompt = `
Classify this Solana transaction event. 

Event data:
${JSON.stringify(rawEvent, null, 2)}

Return JSON with this exact schema:
{
  "relevant": boolean,         // true if worth analyzing further
  "type": string,              // "LARGE_TRANSFER" | "LP_CREATE" | "TOKEN_LAUNCH" | "WHALE_SWAP" | "UNKNOWN"
  "primaryWallet": string,     // main wallet address involved
  "tokens": string[],          // token mint addresses involved
  "amountUsd": number,         // estimated USD value (0 if unknown)
  "confidence": number,        // 0-100 classification confidence
  "reason": string             // brief reason for classification
}`;

  const response = await callLLM(SYSTEM_PROMPT, prompt);
  return JSON.parse(response);
}
