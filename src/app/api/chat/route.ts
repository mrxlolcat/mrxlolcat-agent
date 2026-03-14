import { NextRequest } from "next/server";
import { mrxAgent } from "../../../agent/core/orchestrator";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[chat] Request body:", JSON.stringify(body));
    
    // Delegate all complexity to the Agent Orchestrator
    const result = await mrxAgent.chat(body);
    
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("[chat] Full error:", error);
    const errorMessage = error?.message || error?.cause?.message || error?.toString() || "Unknown error";
    console.error("[chat] Error message:", errorMessage);
    
    // Return as JSON for error cases
    return Response.json(
      { role: "assistant", content: `Error: ${errorMessage} 😿` },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
