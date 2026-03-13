import { NextRequest } from "next/server";
import { publishThankYouCast } from "../../../integrations/neynar";

export async function POST(req: NextRequest) {
  try {
    const { sender, amount, txHash } = await req.json();

    const result = await publishThankYouCast(sender, amount, txHash);
    
    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json(result);
  } catch (error) {
    console.error("[Tip Success Cast Error]:", error);
    return Response.json({ error: "Failed to cast" }, { status: 500 });
  }
}
