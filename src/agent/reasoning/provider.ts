import { createOpenAI } from "@ai-sdk/openai";

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
