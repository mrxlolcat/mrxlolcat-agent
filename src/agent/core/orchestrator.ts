import { streamText } from "ai";
import { getSystemPrompt } from "./brain";
import { getModel } from "../reasoning/provider";
import { getHistory, saveMessage } from "../memory/manager";
import { logger } from "./logger";
import type { ChatRequest } from "../../types";

/**
 * MRX LOLCAT Orchestrator
 * The central intelligence class that manages memory, reasoning, and tool selection.
 */
class MrxLolcatAgent {
  private name = "MRX LOLCAT";

  async chat({ messages, fid, walletAddress, modelId, channel }: ChatRequest) {
    logger.agent(`System processing for FID: ${fid || "anonymous"}`);

    let chatHistory: { role: string; content: string }[] = [];
    const lastMessage = messages[messages.length - 1]?.content || "";

    // 1. Memory Retrieval
    if (fid) {
      try {
        logger.memory(`Accessing Pinecone node for FID: ${fid}`);
        const history = await getHistory(fid);
        chatHistory = history
          .filter((m): m is { role: string; content: string } => !!m.role && !!m.content);
        
        // 2. Memory Archival (User Message)
        saveMessage(fid, "user", lastMessage, walletAddress)
          .catch(e => logger.error("Memory Storage Failed", e));
      } catch (memError) {
        logger.error("Memory Retrieval Interrupted", memError);
      }
    }

    // 3. Model Selection
    const model = await getModel(modelId);
    if (!model) {
      throw new Error("DashScope API key not configured. Set DASHSCOPE_API_KEY in environment variables.");
    }

    // 4. Prompt Assembly
    const systemInstruction = getSystemPrompt(channel, walletAddress);
    const context = chatHistory.length > 0 
      ? [...chatHistory.map(m => ({ role: m.role as "user" | "assistant", content: m.content })), { role: "user" as const, content: lastMessage }] 
      : messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }));

    // 5. Execution & Reasoning Stream
    logger.agent("Launching reasoning stream...");
    
    return streamText({
      model,
      system: systemInstruction,
      messages: context,
      maxTokens: 500,
      temperature: 0.85,
      onFinish: async ({ text }) => {
        if (fid) {
          logger.memory("Archiving reasoning results...");
          saveMessage(fid, "assistant", text, walletAddress)
            .catch(e => logger.error("Assistant Memory Sync Failed", e));
        }
      }
    });
  }
}

// Export a singleton instance
export const mrxAgent = new MrxLolcatAgent();
