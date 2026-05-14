import { config } from "../config/index.js";

export async function sendTelegramAlert(message) {
  if (!config.telegram.botToken || !config.telegram.chatId) return;

  const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: config.telegram.chatId,
      text: message,
      parse_mode: "HTML",
    }),
  });
}
