import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mrxlolcat-agent.vercel.app";
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${appUrl}/og.png" />
        <meta property="fc:frame:button:1" content="Feed Cat 🐟" />
        <meta property="fc:frame:button:2" content="Play with Laser 🔴" />
        <meta property="fc:frame:post_url" content="${appUrl}/api/frame/action" />
      </head>
      <body>mrxlolcat Frame Game</body>
    </html>
  `;
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
