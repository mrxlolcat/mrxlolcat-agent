import { createOpenAI } from "@ai-sdk/openai";

export async function getModel(requestedModelId?: string) {
  // 1. AgentRouter.org (Primary Provider via NewAPI)
  if (process.env.AGENTROUTER_API_KEY) {
    const agentRouter = createOpenAI({
      baseURL: "https://agentrouter.org/v1",
      apiKey: process.env.AGENTROUTER_API_KEY,
    });

    // Strategy: Map requested model or use reliable default
    const model = requestedModelId === "gpt-4o-mini" ? "gpt-4o-mini" : 
                  requestedModelId === "claude-3.5-sonnet" ? "claude-3-5-sonnet" : 
                  requestedModelId || "gpt-4o-mini";

    return agentRouter(model);
  }

  // 2. OpenRouter fallback
  if (process.env.OPENROUTER_API_KEY) {
    const openrouter = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const model = requestedModelId?.includes("claude") 
      ? "anthropic/claude-3.5-sonnet" 
      : "openai/gpt-4o-mini";
      
    return openrouter(model);
  }

  // 3. Direct OpenAI Fallback
  if (process.env.OPENAI_API_KEY) {
    const { openai } = await import("@ai-sdk/openai");
    return openai("gpt-4o-mini");
  }

  // 4. Gemini Fallback
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
     const { google } = await import("@ai-sdk/google");
     return google("gemini-1.5-flash");
  }

  return null;
}

export function localResponse(message: string): string {
  return "my cat brain is buffering... 🧠💫 (API keys not configured)";
}
