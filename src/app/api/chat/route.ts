import { NextRequest } from "next/server";
import { getSystemPrompt, getModel, localResponse } from "../../../agents/cat-brain";
import { getHistory, saveMessage } from "../../../agents/memory";

export async function POST(req: NextRequest) {
  try {
    const { messages, fid, channel, modelId, walletAddress } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    let chatHistory: any[] = [];
    
    // Gunakan Memory Manager (Pinecone) dengan penanganan error yang kuat
    if (fid) {
      try {
        chatHistory = await getHistory(fid);
        // Simpan pesan baru di background agar tidak menghambat streaming
        saveMessage(fid, "user", lastMessage, walletAddress).catch(e => console.error("Memory Save Error:", e));
      } catch (memError) {
        console.error("Memory Retrieve Error (skipping):", memError);
      }
    }

    const model = await getModel(modelId);
    if (model) {
      const { streamText } = await import("ai");
      
      // Gabungkan context: Histori lama + hanya pesan TERAKHIR dari session saat ini 
      // (karena histori Pinecone sudah mencakup pesan-pesan sebelumnya)
      const finalMessages = chatHistory.length > 0 
        ? [...chatHistory, messages[messages.length - 1]] 
        : messages;

      const result = streamText({
        model,
        system: getSystemPrompt(channel, walletAddress),
        messages: finalMessages,
        maxTokens: 500,
        temperature: 0.9,
        // Simpan balasan asisten ke memori setelah stream selesai
        onFinish: async ({ text }) => {
          if (fid) {
            saveMessage(fid, "assistant", text, walletAddress).catch(e => console.error("Memory Assistant Save Error:", e));
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
