import { NextRequest } from "next/server";
import { getSystemPrompt } from "../../../agent/core/brain";
import { getModel, localResponse } from "../../../agent/reasoning/provider";
import { getHistory, saveMessage } from "../../../agent/memory/manager";
import { logger } from "../../../agent/core/logger";

export async function POST(req: NextRequest) {
  try {
    const { messages, fid, channel, modelId, walletAddress } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    logger.agent(`Processing request from FID: ${fid || 'anon'}`);
    let chatHistory: any[] = [];
    
    // Gunakan Memory Manager (Pinecone) dengan penanganan error yang kuat
    if (fid) {
      try {
        logger.memory(`Retrieving vector history for FID: ${fid}`);
        chatHistory = await getHistory(fid);
        
        logger.memory(`Archiving new user message...`);
        saveMessage(fid, "user", lastMessage, walletAddress).catch(e => logger.error("Memory Save Error", e));
      } catch (memError) {
        logger.error("Memory Retrieve Error (skipping)", memError);
      }
    }

    logger.agent(`Selecting LLM model: ${modelId || 'default'}`);
    const model = await getModel(modelId);
    
    if (model) {
      const { streamText } = await import("ai");
      
      logger.agent(`Executing reasoning stream...`);
      const finalMessages = chatHistory.length > 0 
        ? [...chatHistory, messages[messages.length - 1]] 
        : messages;

      const result = streamText({
        model,
        system: getSystemPrompt(channel, walletAddress),
        messages: finalMessages,
        maxTokens: 500,
        temperature: 0.9,
        onFinish: async ({ text }) => {
          if (fid) {
            logger.memory(`Archiving assistant response...`);
            saveMessage(fid, "assistant", text, walletAddress).catch(e => logger.error("Assistant Memory Save Error", e));
          }
        }
      });
      
      return result.toDataStreamResponse();
    }

    await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000));
    const reply = localResponse(lastMessage);
    return Response.json({ role: "assistant", content: reply });
  } catch (error) {
    console.error("[mrxlolcat-agent] chat error:", error);
    return Response.json(
      { role: "assistant", content: "oops, cat brain crashed 😿 try again!" },
      { status: 500 }
    );
  }
}
