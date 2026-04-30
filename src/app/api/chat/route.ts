import { NextRequest } from "next/server";
import { mrxAgent } from "../../../agent/core/orchestrator";
import type { ApiErrorResponse } from "../../../types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await mrxAgent.chat(body);
    return result.toDataStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[chat] Error:", message);

    const errorResponse: ApiErrorResponse = {
      error: "chat_error",
      message,
      statusCode: 500,
    };

    return Response.json(errorResponse, { status: 500 });
  }
}
