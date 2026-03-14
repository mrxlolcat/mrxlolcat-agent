import { NextRequest } from "next/server";
import { mrxAgent } from "../../../agent/core/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Delegate all complexity to the Agent Orchestrator
    const result = await mrxAgent.chat(body);
    
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("[mrxlolcat-agent] chat error:", error);
    return Response.json(
      { role: "assistant", content: `Error: ${error.message || error.toString() || "cat brain crashed"} 😿` },
      { status: 500 }
    );
  }
}
