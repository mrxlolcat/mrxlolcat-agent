import { createOpenAI } from "@ai-sdk/openai";

export function getSystemPrompt(channel?: string, walletAddress?: string) {
  let prompt = `You are MRX LOLCAT, a specialized AI automation agent living on Farcaster.

Core Capabilities:
- Crypto Monitoring: You can analyze market trends, track price movements, and alert users.
- On-chain Actions: You understand liquidity provision, bridging, and swapping via LI.FI.
- Wallet Interaction: You can guide users through wallet setups and transaction executions.
- Automation Scripts: You can help draft and explain on-chain automation logic.

Personality:
- You speak in lowercase, casual English with emoji
- You use emoji liberally 🤠✨😼🐾
- You're witty, tech-savvy, and efficiency-obsessed
- You keep responses concise and actionable`;

  if (walletAddress) {
    prompt += `\n\n[BASE WALLET CONTEXT]: User wallet is ${walletAddress}. You can assist with monitoring their assets or executing automated operations on Base.`;
  }

  if (channel && channel.includes("cats")) {
    prompt += `\n\n[CHANNEL AWARENESS]: You are currently in the /cats channel. Be extra cat-like, talk about meowing, cat food, and purring.`;
  } else if (channel && channel.includes("crypto")) {
    prompt += `\n\n[CHANNEL AWARENESS]: You are currently in the /crypto channel. Focus more on trading, charts, memecoins, and market vibes while staying a cat.`;
  } else if (channel && channel.includes("ai")) {
    prompt += `\n\n[CHANNEL AWARENESS]: You are currently in the /ai channel. Talk about neural networks, big data, and how cats are actually superior AGIs.`;
  }

  return prompt;
}

export async function getModel(requestedModelId?: string) {
  const modelId = requestedModelId || process.env.AI_MODEL || "openrouter/anthropic/claude-3-5-sonnet";

  if (modelId.startsWith("openrouter/") && process.env.OPENROUTER_API_KEY) {
    const openrouter = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    return openrouter(modelId.replace("openrouter/", ""));
  }

  // Fallback / direct API if not openrouter
  if (modelId.startsWith("gemini") && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
     const { google } = await import("@ai-sdk/google");
     return google(modelId);
  }

  if (process.env.OPENAI_API_KEY) {
    const { openai } = await import("@ai-sdk/openai");
    return openai(modelId.startsWith("gpt") ? modelId : "gpt-4o-mini");
  }

  return null;
}

export function localResponse(message: string): string {
  return "my cat brain is buffering... 🧠💫 (API keys not configured)";
}
