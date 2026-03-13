import { NextRequest } from "next/server";
import { getSystemPrompt, getModel, localResponse } from "../../../agents/cat-persona";
import { getHistory, saveMessage } from "../../../agents/memory-manager";

export async function POST(req: NextRequest) {
  try {
    const { messages, fid, channel, modelId } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    let chatHistory: any[] = [];
    
    // Gunakan Memory Manager (Pinecone) untuk mengambil histori chat per FID
    if (fid) {
      chatHistory = await getHistory(fid);
      await saveMessage(fid, "user", lastMessage);
    }

    const model = await getModel(modelId);
    if (model) {
      const { streamText } = await import("ai");
      
      const fullMessages = chatHistory.length > 0 ? [...chatHistory, ...messages.slice(-1)] : messages;

      const result = streamText({
        model,
        system: getSystemPrompt(channel),
        messages: fullMessages,
        maxTokens: 500,
        temperature: 0.9,
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
