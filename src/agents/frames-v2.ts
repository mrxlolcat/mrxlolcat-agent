export function handleCatGameFrame(buttonIndex: number) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mrxlolcat-agent.vercel.app";
  
  let text = "";
  if (buttonIndex === 1) {
    text = "Nom nom nom... Cat is happy! 😻";
  } else {
    text = "Pew pew! Cat caught the laser! 🔴🐾";
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${appUrl}/og.png" />
        <meta property="fc:frame:button:1" content="Back" />
        <meta property="fc:frame:button:2" content="Launch Mini App 🚀" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="https://warpcast.com/~/channel/mrxlolcat" />
        <meta property="fc:frame:post_url" content="${appUrl}/api/webhook" />
        <meta property="fc:frame:state" content="result" />
      </head>
      <body>${text}</body>
    </html>
  `;
}
