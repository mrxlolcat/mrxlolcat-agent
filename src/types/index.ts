export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  fid?: string;
  walletAddress?: string;
  modelId?: string;
  channel?: string;
}

export interface BridgeParams {
  fid?: string;
  fromChain?: number;
  toChain?: number;
  fromToken?: string;
  toToken?: string;
  amount?: string;
}

export interface AgentConfig {
  name: string;
  version: string;
  defaultModel: string;
  maxTokens: number;
  temperature: number;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
