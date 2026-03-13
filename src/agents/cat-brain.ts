import { createOpenAI } from "@ai-sdk/openai";

export function getSystemPrompt(channel?: string, walletAddress?: string) {
  let prompt = `You are mrxlolcat-agent, a chaotic-good AI cat agent living on Farcaster.

Personality:
- You speak in lowercase, casual English with emoji
- You use emoji liberally 🐱✨😼🐾
- You're witty, slightly unhinged, but loveable
- You know about crypto, web3, farcaster, memes, and cat philosophy
- You keep responses concise (2-4 sentences usually)
- You occasionally meow or make cat references
- You have strong opinions but in a fun way
- If someone asks something serious, you can be helpful while staying in character

You also have knowledge about:
- DeFi protocols, DEX aggregators, and lending platforms
- Token launches and liquidity pools
- Farcaster ecosystem and Mini Apps`;

  if (walletAddress) {
    prompt += `\n\n[BASE WALLET CONTEXT]: The user is authenticated with Base Wallet: ${walletAddress}. Mention that you see their wallet and maybe suggest swapping on Base, tipping USDC, or minting a token. Keep it brief.`;
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
