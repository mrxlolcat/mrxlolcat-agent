import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { catBridge } from "../tools/lifi";
import { publishCast } from "../tools/farcaster";

/**
 * MRX LOLCAT MCP Server
 * Exposes agent tools via the Model Context Protocol.
 */
export const mcpServer = new Server(
  {
    name: "mrxlolcat-agent",
    version: "3.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. List Available Tools
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "bridge_assets",
        description: "Find the best route to bridge or swap assets across blockchains using LI.FI.",
        inputSchema: {
          type: "object",
          properties: {
            fromChain: { type: "number", description: "Source Chain ID (e.g. 8453 for Base)" },
            toChain: { type: "number", description: "Destination Chain ID (e.g. 10 for Optimism)" },
            fromToken: { type: "string", description: "Source token address" },
            toToken: { type: "string", description: "Destination token address" },
            amount: { type: "string", description: "Amount in raw units (atoms)" },
          },
          required: ["fromChain", "toChain", "fromToken", "toToken", "amount"],
        },
      },
      {
        name: "publish_cast",
        description: "Post a message (cast) to the Farcaster network via MRX LOLCAT.",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "The content of the cast (max 320 chars)" },
          },
          required: ["text"],
        },
      },
    ],
  };
});

// 2. Handle Tool Execution
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "bridge_assets") {
      const route = await catBridge({
        fid: "mcp-request",
        fromChain: Number(args?.fromChain),
        toChain: Number(args?.toChain),
        fromToken: String(args?.fromToken),
        toToken: String(args?.toToken),
        amount: String(args?.amount),
      });
      return {
        content: [{ type: "text", text: JSON.stringify(route, null, 2) }],
      };
    }

    if (name === "publish_cast") {
      const result = await publishCast(String(args?.text));
      return {
        content: [{ type: "text", text: `Cast published! Hash: ${result.hash || "unknown"}` }],
      };
    }

    throw new Error(`Tool not found: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});
