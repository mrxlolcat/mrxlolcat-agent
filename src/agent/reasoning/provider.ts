import { createOpenAI } from "@ai-sdk/openai";

// Available DashScope Models (Singapore Endpoint)
const DASHSCOPE_MODELS = {
  // Text Models
  "qwen-plus": "qwen-plus",           // Balanced (default)
  "qwen-turbo": "qwen-turbo",         // Fast
  "qwen-max": "qwen-max",             // Advanced
  "qwen2.5-72b-instruct": "qwen2.5-72b-instruct",   // Large
  "qwen2.5-32b-instruct": "qwen2.5-32b-instruct",   // Medium
  "qwen2.5-14b-instruct": "qwen2.5-14b-instruct",   // Small
  "qwen2.5-7b-instruct": "qwen2.5-7b-instruct",     // Tiny
  
  // Vision Models
  "qwen-vl-plus": "qwen-vl-plus",     // Vision
  "qwen-vl-max": "qwen-vl-max",       // Vision Advanced
  
  // Legacy mappings
  "gpt-4o-mini": "qwen-plus",
  "gpt-4o": "qwen-max",
  "claude-3.5-sonnet": "qwen2.5-72b-instruct",
  "gemini-1.5-flash": "qwen-turbo",
} as const;

export async function getModel(requestedModelId?: string) {
  // 0. DashScope (Alibaba Cloud Qwen) - Singapore International Endpoint
  if (process.env.DASHSCOPE_API_KEY) {
    const dashscope = createOpenAI({
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
      apiKey: process.env.DASHSCOPE_API_KEY,
    });

    // Map requested model or use default
    const model = DASHSCOPE_MODELS[requestedModelId as keyof typeof DASHSCOPE_MODELS] 
      || process.env.AI_MODEL 
      || "qwen-plus";

    return dashscope(model);
  }

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
