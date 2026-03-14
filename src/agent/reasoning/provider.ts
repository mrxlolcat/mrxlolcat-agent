import { createOpenAI } from "@ai-sdk/openai";

export async function getModel(requestedModelId?: string) {
  // Default to OpenRouter Claude with correct model ID format
  const modelId = requestedModelId || process.env.AI_MODEL || "openrouter/anthropic/claude-3.5-sonnet";

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
    // Map model aliases to actual model names
    const actualModel = modelId.startsWith("gpt") ? modelId : 
                        modelId === "claude-3.5-sonnet" ? "gpt-4o-mini" : 
                        modelId === "gpt-4o-mini" ? "gpt-4o-mini" : "gpt-4o-mini";
    return openai(actualModel);
  }

  // Last resort fallback - use OpenRouter if key exists even without prefix
  if (process.env.OPENROUTER_API_KEY) {
    const openrouter = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    return openrouter("anthropic/claude-3.5-sonnet");
  }

  return null;
}

export function localResponse(message: string): string {
  return "my cat brain is buffering... 🧠💫 (API keys not configured)";
}
