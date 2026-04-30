import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";
import { createOpenAI } from "@ai-sdk/openai";
import { embed } from "ai";

const pc = process.env.PINECONE_API_KEY ? new Pinecone({ apiKey: process.env.PINECONE_API_KEY }) : null;

const indexName = "cat-agent-memory";

interface AgentMemoryMetadata extends RecordMetadata {
  fid: string;
  walletAddress: string;
  role: string;
  content: string;
  timestamp: number;
}

const EMBEDDING_DIMENSION = 1024;

async function getEmbedding(text: string): Promise<number[]> {
  if (!process.env.DASHSCOPE_API_KEY) {
    return Array(EMBEDDING_DIMENSION).fill(0);
  }

  try {
    const dashscope = createOpenAI({
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
      apiKey: process.env.DASHSCOPE_API_KEY,
    });

    const { embedding } = await embed({
      model: dashscope.embedding("text-embedding-v3", { dimensions: EMBEDDING_DIMENSION }),
      value: text,
    });
    return embedding;
  } catch (error) {
    console.error("DashScope embedding generation failed:", error);
    return Array(EMBEDDING_DIMENSION).fill(0);
  }
}

export async function getHistory(fid: string, limit: number = 10) {
  if (!pc || !fid) return [];

  try {
    const index = pc.Index<AgentMemoryMetadata>(indexName);

    const queryResponse = await index.query({
      topK: limit,
      vector: Array(EMBEDDING_DIMENSION).fill(0),
      filter: { fid: { "$eq": fid } },
      includeMetadata: true,
    });

    if (!queryResponse.matches) return [];

    const sorted = queryResponse.matches.sort((a, b) => {
      const timeA = a.metadata?.timestamp || 0;
      const timeB = b.metadata?.timestamp || 0;
      return timeA - timeB;
    });

    return sorted.map(m => ({
      role: m.metadata?.role,
      content: m.metadata?.content,
    }));
  } catch (error) {
    console.error("Pinecone Query Error:", error);
    return [];
  }
}

export async function saveMessage(fid: string, role: "user" | "assistant", content: string, walletAddress?: string) {
  if (!pc || !fid) return;

  try {
    const index = pc.Index<AgentMemoryMetadata>(indexName);
    const timestamp = Date.now();
    const id = `msg_${fid}_${timestamp}`;

    const vectorData = await getEmbedding(content);

    await index.upsert({
      records: [{
        id,
        values: vectorData,
        metadata: {
          fid,
          walletAddress: walletAddress || "",
          role,
          content,
          timestamp,
        }
      }]
    });

  } catch (error) {
    console.error("Pinecone Upsert Error:", error);
  }
}
