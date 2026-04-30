import { createOpenAI } from "@ai-sdk/openai";

const DASHSCOPE_MODELS = {
  "qwen-plus": "qwen-plus",
  "qwen-turbo": "qwen-turbo",
  "qwen-max": "qwen-max",
  "qwen2.5-72b-instruct": "qwen2.5-72b-instruct",
  "qwen2.5-32b-instruct": "qwen2.5-32b-instruct",
  "qwen2.5-14b-instruct": "qwen2.5-14b-instruct",
  "qwen2.5-7b-instruct": "qwen2.5-7b-instruct",
  "qwen-vl-plus": "qwen-vl-plus",
  "qwen-vl-max": "qwen-vl-max",
} as const;

export type DashScopeModelId = keyof typeof DASHSCOPE_MODELS;

export const AVAILABLE_MODELS: { id: DashScopeModelId; label: string }[] = [
  { id: "qwen-plus", label: "Qwen Plus (Balanced)" },
  { id: "qwen-turbo", label: "Qwen Turbo (Fast)" },
  { id: "qwen-max", label: "Qwen Max (Advanced)" },
  { id: "qwen2.5-72b-instruct", label: "Qwen 2.5 72B" },
];

export async function getModel(requestedModelId?: string) {
  if (!process.env.DASHSCOPE_API_KEY) {
    return null;
  }

  const dashscope = createOpenAI({
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    apiKey: process.env.DASHSCOPE_API_KEY,
  });

  const modelId =
    DASHSCOPE_MODELS[requestedModelId as DashScopeModelId] ||
    process.env.AI_MODEL ||
    "qwen-plus";

  return dashscope(modelId);
}
