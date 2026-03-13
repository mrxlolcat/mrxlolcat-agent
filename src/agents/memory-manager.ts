import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

const pc = process.env.PINECONE_API_KEY ? new Pinecone({ apiKey: process.env.PINECONE_API_KEY }) : null;

// Menggunakan index default atau spesifik
const indexName = "cat-agent-memory"; 

export const redis = null; // Removed upstash redis to prevent reference errors

interface AgentMemoryMetadata extends RecordMetadata {
  fid: string;
  role: string;
  content: string;
  timestamp: number;
}

// Fungsi pembantu untuk membuat vektor embedding nyata dari teks
async function getEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    // Fallback vector jika tidak ada API key OpenAI
    return Array(1536).fill(0);
  }
  
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text,
    });
    return embedding;
  } catch (error) {
    console.error("Embedding generation failed:", error);
    return Array(1536).fill(0);
  }
}

export async function getHistory(fid: string, limit: number = 10) {
  if (!pc || !fid) return [];
  
  try {
    const index = pc.Index<AgentMemoryMetadata>(indexName);
    
    // Karena kita tidak mencari query semantik (belum ada user input spesifik),
    // kita mencari vektor dummy dengan filter FID yang kuat untuk mengambil historis secara urut waktu
    const queryResponse = await index.query({
      topK: limit,
      vector: Array(1536).fill(0),
      filter: { fid: { "$eq": fid } },
      includeMetadata: true,
    });

    if (!queryResponse.matches) return [];

    // Mengurutkan pesan berdasarkan timestamp
    const sorted = queryResponse.matches.sort((a, b) => {
      const timeA = a.metadata?.timestamp || 0;
      const timeB = b.metadata?.timestamp || 0;
      return timeA - timeB; // ascending
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

export async function saveMessage(fid: string, role: "user" | "assistant", content: string) {
  if (!pc || !fid) return;
  
  try {
    const index = pc.Index<AgentMemoryMetadata>(indexName);
    const timestamp = Date.now();
    const id = `msg_${fid}_${timestamp}`;

    // Generate vektor sungguhan dari konten pesan
    const vectorData = await getEmbedding(content);

    await index.upsert([{
      id,
      values: vectorData,
      metadata: {
        fid,
        role,
        content,
        timestamp,
      }
    }] as any);

  } catch (error) {
    console.error("Pinecone Upsert Error:", error);
  }
}
