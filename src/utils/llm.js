import { config } from "../config/index.js";
import { logger } from "./logger.js";

/**
 * Generic LLM client — OpenAI-compatible API
 * Works with: MiMo, OpenAI, Anthropic (via proxy), Groq, Together, Ollama, etc.
 * Just set LLM_BASE_URL + LLM_API_KEY + LLM_MODEL in .env
 */
export async function callLLM(systemPrompt, userPrompt, options = {}) {
  const baseUrl = options.baseUrl || config.llm.baseUrl;
  const apiKey = options.apiKey || config.llm.apiKey;
  const model = options.model || config.llm.model;

  logger.debug(`LLM call → ${baseUrl} | model: ${model}`);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: options.temperature ?? 0.1,
      max_tokens: options.maxTokens || 1024,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LLM API error ${response.status} from ${baseUrl}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) throw new Error("Empty response from LLM");
  return content;
}
