import { createServer } from "http";
import { config } from "../config/index.js";
import { logger } from "./logger.js";

/**
 * Start HTTP server to receive Helius webhook events
 */
export function startWebhookServer(onEvent) {
  const server = createServer(async (req, res) => {
    if (req.method !== "POST" || req.url !== config.server.webhookPath) {
      res.writeHead(404);
      res.end();
      return;
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const events = JSON.parse(body);
        const eventArray = Array.isArray(events) ? events : [events];

        // Respond immediately — process async
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ received: eventArray.length }));

        for (const event of eventArray) {
          await onEvent(event);
        }
      } catch (err) {
        logger.error(`Webhook parse error: ${err.message}`);
        res.writeHead(400);
        res.end();
      }
    });
  });

  server.listen(config.server.port, () => {
    logger.info(`✅ Webhook server listening on port ${config.server.port}`);
    logger.info(`📌 Endpoint: POST ${config.server.webhookPath}`);
  });

  return server;
}
