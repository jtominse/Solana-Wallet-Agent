import { callLLM } from "../utils/llm.js";
import { sendTelegramAlert } from "../utils/telegram.js";

const SYSTEM_PROMPT = `You are a DeFi alert writer. 
Generate clear, actionable alerts for on-chain events.
Always respond with valid JSON only. No markdown, no explanation.`;

/**
 * Agent 4: Generate human-readable alert with recommended action
 * Output: { summary, detail, recommendedAction, telegramMessage }
 */
export async function generateAlert({ classification, walletProfile, riskAssessment, rawEvent }) {
  const prompt = `
Generate a clear alert for this on-chain event.

Classification: ${JSON.stringify(classification)}
Wallet Profile: ${JSON.stringify(walletProfile)}
Risk Assessment: ${JSON.stringify(riskAssessment)}

Return JSON with this exact schema:
{
  "summary": string,           // 1-line summary (max 100 chars)
  "detail": string,            // 2-3 sentence detailed explanation
  "recommendedAction": string, // specific action to take
  "telegramMessage": string,   // formatted message for Telegram (with emojis)
  "tags": string[]             // categorization tags
}`;

  const response = await callLLM(SYSTEM_PROMPT, prompt);
  const alert = JSON.parse(response);

  // Auto-send to Telegram if risk is HIGH or CRITICAL
  if (["HIGH", "CRITICAL"].includes(riskAssessment.level)) {
    await sendTelegramAlert(alert.telegramMessage).catch((e) =>
      console.warn("Telegram send failed:", e.message)
    );
  }

  return alert;
}
