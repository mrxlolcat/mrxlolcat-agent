import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mrxlolcat-agent.vercel.app";
  
  try {
    const body = await req.json();
    const buttonIndex = body?.untrustedData?.buttonIndex || 1;

    let text = "";
    if (buttonIndex === 1) {
      text = "Nom nom nom... Cat is happy! 😻";
    } else {
      text = "Pew pew! Cat caught the laser! 🔴🐾";
    }

    // Mengembalikan response frame vNext dengan teks yang diperbarui
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${appUrl}/og.png" />
          <meta property="fc:frame:button:1" content="Back" />
          <meta property="fc:frame:button:2" content="Launch Mini App 🚀" />
          <meta property="fc:frame:button:2:action" content="link" />
          <meta property="fc:frame:button:2:target" content="https://warpcast.com/~/channel/mrxlolcat" />
          <meta property="fc:frame:post_url" content="${appUrl}/api/frame" />
          <meta property="fc:frame:state" content="result" />
          <!-- Optional text rendering on image if dynamic image generation is used, for now just logic -->
        </head>
        <body>${text}</body>
      </html>
    `;

    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}
