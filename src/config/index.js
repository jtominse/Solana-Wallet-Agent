import "dotenv/config";

export const config = {
  helius: {
    rpcUrl: process.env.HELIUS_RPC_URL || "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
    apiKey: process.env.HELIUS_API_KEY || "",
    webhookSecret: process.env.HELIUS_WEBHOOK_SECRET || "",
  },

  // Generic LLM provider — swap any OpenAI-compatible API
  llm: {
    baseUrl: process.env.LLM_BASE_URL || "https://api.openai.com/v1",
    apiKey: process.env.LLM_API_KEY || "",
    model: process.env.LLM_MODEL || "gpt-4o",
  },

  server: {
    port: parseInt(process.env.PORT || "3000"),
    webhookPath: "/webhook/helius",
  },
  thresholds: {
    largeTransferSol: parseFloat(process.env.LARGE_TRANSFER_SOL || "100"),
    largeTransferUsd: parseFloat(process.env.LARGE_TRANSFER_USD || "10000"),
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || "",
    chatId: process.env.TELEGRAM_CHAT_ID || "",
  },
};
