/**
 * Run once to register your webhook with Helius
 * Usage: node scripts/register-webhook.js <your-public-url>
 */
import { registerWebhook } from "../src/utils/helius.js";
import { config } from "../src/config/index.js";

const webhookUrl = process.argv[2];
if (!webhookUrl) {
  console.error("Usage: node scripts/register-webhook.js https://your-domain.com/webhook/helius");
  process.exit(1);
}

console.log(`Registering webhook: ${webhookUrl}`);
const result = await registerWebhook(webhookUrl, [], ["TRANSFER", "SWAP", "ADD_LIQUIDITY"]);
console.log("✅ Webhook registered:", result);
console.log(`\nWebhook ID: ${result.webhookID}`);
console.log(`Set HELIUS_WEBHOOK_SECRET in your .env if using secret validation.`);
