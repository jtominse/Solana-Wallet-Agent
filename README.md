# 🔍 Solana Wallet Intelligence Agent

A real-time on-chain monitoring agent that uses **Helius RPC webhooks** as the data layer and any **OpenAI-compatible LLM** as the reasoning engine. Automatically detects and classifies actionable on-chain signals — whale movements, LP creations, token launches, and rug risks — without any manual monitoring.

Supports **MiMo, OpenAI, Anthropic, Groq, Together AI, Ollama** and any other OpenAI-compatible provider. Just set 3 env vars.

---

## Architecture

```
Helius Webhook (real-time event)
        │
        ▼
┌─────────────────────────────────────────────┐
│              4-Step Agent Pipeline          │
│                                             │
│  [1] Classifier     → event type + wallet  │
│         │                                   │
│  [2] Wallet Analyzer → behavioral profile  │
│         │                                   │
│  [3] Risk Scorer    → score 0-100 + level  │
│         │                                   │
│  [4] Alert Generator → summary + action    │
└─────────────────────────────────────────────┘
        │
        ▼
  Telegram Alert (HIGH/CRITICAL only)
```

Each step passes **structured JSON** to the next agent, ensuring clean input and deterministic reasoning across the chain.

---

## Features

- **Real-time event ingestion** via Helius Enhanced Webhooks
- **4-step multi-agent reasoning** chain
- **Provider-agnostic LLM** — swap any model with just 3 env vars
- **Wallet behavioral profiling** — distinguishes whales, bots, retail, new wallets
- **Risk/opportunity scoring** — detects rug risks, whale accumulation, arb windows
- **Telegram notifications** for HIGH and CRITICAL signals
- **Structured JSON output** at every agent step for reliability

---

## Quickstart

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/solana-wallet-agent.git
cd solana-wallet-agent
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — set HELIUS_API_KEY + LLM_BASE_URL + LLM_API_KEY + LLM_MODEL
```

**Supported LLM providers (just change 3 vars):**

| Provider | LLM_BASE_URL | LLM_MODEL |
|---|---|---|
| **MiMo** | `https://api.xiaomimimo.com/v1` | `mimo-reasoning-v2.5` |
| **OpenAI** | `https://api.openai.com/v1` | `gpt-4o` |
| **Groq** | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` |
| **Together** | `https://api.together.xyz/v1` | `meta-llama/Llama-3-70b-chat-hf` |
| **Ollama** | `http://localhost:11434/v1` | `llama3.2` |

### 3. Register Helius webhook

```bash
node scripts/register-webhook.js https://your-domain.com/webhook/helius
```

### 4. Run

```bash
npm start
# or for dev with auto-restart:
npm run dev
```

---

## Project Structure

```
src/
├── index.js                  # Entry point, webhook server bootstrap
├── config/
│   └── index.js              # Centralized config from env vars
├── agents/
│   ├── pipeline.js           # Main 4-step orchestration
│   ├── classifier.js         # Agent 1: Event classification
│   ├── walletAnalyzer.js     # Agent 2: Wallet behavior analysis
│   ├── riskScorer.js         # Agent 3: Risk/opportunity scoring
│   └── alertGenerator.js    # Agent 4: Alert generation + Telegram
└── utils/
    ├── llm.js                # Generic OpenAI-compatible LLM client
    ├── helius.js             # Helius RPC + webhook utils
    ├── webhook.js            # HTTP server for incoming webhooks
    ├── telegram.js           # Telegram alert sender
    └── logger.js
scripts/
└── register-webhook.js       # One-time webhook registration
```

---

## Agent Pipeline Detail

### Agent 1 — Event Classifier
Classifies raw Helius events into typed categories: `LARGE_TRANSFER`, `LP_CREATE`, `TOKEN_LAUNCH`, `WHALE_SWAP`. Filters irrelevant events early to save tokens.

### Agent 2 — Wallet Analyzer
Fetches the wallet's recent 20 transactions via Helius, then uses the LLM to build a behavioral profile: wallet type, activity level, age, patterns, and red flags.

### Agent 3 — Risk Scorer
Combines classification + wallet profile to output a 0–100 risk score with level (`LOW` / `MEDIUM` / `HIGH` / `CRITICAL`) and opportunity type (`RUG_RISK`, `WHALE_ACCUMULATION`, `ARB_WINDOW`).

### Agent 4 — Alert Generator
Produces a human-readable summary, detailed explanation, and recommended action. Auto-sends to Telegram for HIGH/CRITICAL signals.

---

## Token Usage

Estimated consumption per event processed:
- Classifier: ~500 tokens
- Wallet Analyzer: ~1,500 tokens
- Risk Scorer: ~800 tokens
- Alert Generator: ~700 tokens
- **Total per event: ~3,500 tokens**

At 1,000 events/day → ~3.5M tokens/day

---

## License

MIT
