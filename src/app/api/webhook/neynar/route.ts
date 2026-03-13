import { NextRequest } from "next/server";
import { handleCatGameFrame } from "../../../../agents/frames-v2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const buttonIndex = body?.untrustedData?.buttonIndex || 1;

    // Gunakan frame handler dari modul agents
    const html = handleCatGameFrame(buttonIndex);

    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    return new Response("Error processing frame", { status: 500 });
  }
}
