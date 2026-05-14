import { startWebhookServer } from "./utils/webhook.js";
import { processEvent } from "./agents/pipeline.js";
import { logger } from "./utils/logger.js";
import { config } from "./config/index.js";

logger.info("🚀 Solana Wallet Intelligence Agent starting...");
logger.info(`📡 Helius RPC: ${config.helius.rpcUrl}`);

// Start webhook server to receive Helius events
startWebhookServer(async (event) => {
  logger.info(`📥 Received event: ${event.type} | tx: ${event.signature?.slice(0, 12)}...`);
  try {
    const result = await processEvent(event);
    if (result.actionable) {
      logger.info(`🚨 ALERT [${result.risk}] ${result.summary}`);
    }
  } catch (err) {
    logger.error(`Pipeline error: ${err.message}`);
  }
});
