import { callLLM } from "../utils/llm.js";
import { getWalletHistory } from "../utils/helius.js";

const SYSTEM_PROMPT = `You are a Solana wallet behavior analyst.
Given a wallet address and its recent transaction history, identify behavioral patterns.
Always respond with valid JSON only. No markdown, no explanation.`;

/**
 * Agent 2: Cross-reference wallet's historical behavior
 * Output: { walletType, activityLevel, patterns, redFlags, trustScore }
 */
export async function analyzeWallet({ address, eventType, rawEvent }) {
  // Fetch on-chain history via Helius
  const history = await getWalletHistory(address);

  const prompt = `
Analyze this Solana wallet's behavior patterns.

Wallet Address: ${address}
Current Event Type: ${eventType}
Recent Transaction History (last 20 txns):
${JSON.stringify(history, null, 2)}

Return JSON with this exact schema:
{
  "walletType": string,       // "WHALE" | "BOT" | "RETAIL" | "PROTOCOL" | "NEW_WALLET" | "UNKNOWN"
  "activityLevel": string,    // "HIGH" | "MEDIUM" | "LOW"
  "ageInDays": number,        // estimated wallet age
  "patterns": string[],       // observed behavioral patterns
  "redFlags": string[],       // suspicious signals if any
  "trustScore": number,       // 0-100, higher = more trustworthy
  "summary": string           // 1-2 sentence behavioral summary
}`;

  const response = await callLLM(SYSTEM_PROMPT, prompt);
  return JSON.parse(response);
}
