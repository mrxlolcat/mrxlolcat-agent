import { Pinecone } from "@pinecone-database/pinecone";

const pc = process.env.PINECONE_API_KEY ? new Pinecone({ apiKey: process.env.PINECONE_API_KEY }) : null;

// Menggunakan index default atau spesifik
const indexName = "cat-agent-memory"; 

export const redis = null; // Removed upstash redis to prevent reference errors in other files that imported it temporarily. 

export async function getHistory(fid: string, limit: number = 10) {
  if (!pc || !fid) return [];
  
  try {
    const index = pc.Index(indexName);
    
    // Asumsikan kita menyimpan data historis dengan id berurutan atau mengambilnya dari metadata
    // Karena ini adalah mock-up penggunaan Pinecone untuk chat history, 
    // kita akan melakukan query vector dummy yang mengembalikan metadata milik FID terkait
    const queryResponse = await index.query({
      topK: limit,
      vector: Array(1536).fill(0), // Dummy vector jika tidak ada embed model aktif
      filter: { fid: { "$eq": fid } },
      includeMetadata: true,
    });

    if (!queryResponse.matches) return [];

    // Mengurutkan pesan berdasarkan timestamp jika ada di metadata
    const sorted = queryResponse.matches.sort((a, b) => {
      const timeA = (a.metadata?.timestamp as number) || 0;
      const timeB = (b.metadata?.timestamp as number) || 0;
      return timeA - timeB; // ascending
    });

    return sorted.map(m => ({
      role: m.metadata?.role as string,
      content: m.metadata?.content as string,
    }));
  } catch (error) {
    console.error("Pinecone Query Error:", error);
    return [];
  }
}

export async function saveMessage(fid: string, role: "user" | "assistant", content: string) {
  if (!pc || !fid) return;
  
  try {
    const index = pc.Index(indexName);
    const timestamp = Date.now();
    const id = `msg_${fid}_${timestamp}`;

    await index.upsert([{
      id,
      values: Array(1536).fill(0), // Dummy vector (misal dimensi OpenAI 1536)
      metadata: {
        fid,
        role,
        content,
        timestamp,
      }
    }] as any);

    // Opsional: Untuk memenuhi target retensi 30 hari (30 * 24 * 60 * 60 * 1000 ms),
    // kita bisa menghitung timestamp lama dan melakukan penghapusan via API di background cron.
    // Pinecone tidak memiliki TTL bawaan seperti Redis, sehingga pengelolaan dilakukan di kode.

  } catch (error) {
    console.error("Pinecone Upsert Error:", error);
  }
}
