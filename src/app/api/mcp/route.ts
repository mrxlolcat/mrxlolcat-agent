import { NextRequest, NextResponse } from "next/server";
import { mcpServer } from "../../../agent/core/mcp";

/**
 * MCP HTTP Bridge
 * This endpoint allows the MCP server to run in a serverless environment
 * by handling JSON-RPC requests via POST.
 */
export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    // Directly handle the JSON-RPC request using the MCP Server instance
    // Note: In a full implementation, we might need to manage session/transport state
    // but for stateless tool calls, this direct mapping works.
    const response = await (mcpServer as any).handleRequest(request);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[MCP API Error]:", error);
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32603, message: error.message }, id: null },
      { status: 500 }
    );
  }
}

// Optionally handle GET for discovery/capabilities
export async function GET() {
  return NextResponse.json({
    mcp_version: "3.0.0",
    supported_methods: ["list_tools", "call_tool"],
    endpoint: "/api/mcp"
  });
}
