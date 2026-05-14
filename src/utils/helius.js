import { config } from "../config/index.js";

const HELIUS_BASE = "https://api.helius.xyz/v0";

/**
 * Get wallet transaction history via Helius Enhanced Transactions API
 */
export async function getWalletHistory(address, limit = 20) {
  const url = `${HELIUS_BASE}/addresses/${address}/transactions?api-key=${config.helius.apiKey}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Helius API error: ${response.status}`);
  }

  const txns = await response.json();

  // Normalize to clean format for LLM consumption
  return txns.map((tx) => ({
    signature: tx.signature,
    type: tx.type,
    timestamp: tx.timestamp,
    fee: tx.fee,
    nativeTransfers: tx.nativeTransfers?.map((t) => ({
      from: t.fromUserAccount,
      to: t.toUserAccount,
      amount: t.amount / 1e9, // lamports to SOL
    })),
    tokenTransfers: tx.tokenTransfers?.map((t) => ({
      mint: t.mint,
      from: t.fromUserAccount,
      to: t.toUserAccount,
      amount: t.tokenAmount,
    })),
    source: tx.source,
    description: tx.description,
  }));
}

/**
 * Register a Helius webhook for real-time events
 */
export async function registerWebhook(webhookUrl, addresses = [], types = []) {
  const response = await fetch(`${HELIUS_BASE}/webhooks?api-key=${config.helius.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      webhookURL: webhookUrl,
      transactionTypes: types.length ? types : ["ANY"],
      accountAddresses: addresses,
      webhookType: "enhanced",
    }),
  });

  if (!response.ok) throw new Error(`Failed to register webhook: ${response.status}`);
  return response.json();
}
