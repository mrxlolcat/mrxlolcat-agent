import { publishThankYouCast } from '../neynar';

// Mockup Farcaster Frame endpoint result untuk LI.FI swap success
export async function handleLifiFrameSuccess(buttonIndex: number, txHash: string, amount: string, senderAddress: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mrxlolcat-agent.vercel.app";
  
  // Opsi: Publish thank you cast (seperti Tipjar)
  await publishThankYouCast(senderAddress, amount, txHash);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${appUrl}/og.png" />
        <meta property="fc:frame:button:1" content="View on Explorer 🔗" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://basescan.org/tx/${txHash}" />
        <meta property="fc:frame:button:2" content="Launch Mini App 🚀" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="https://warpcast.com/~/channel/mrxlolcat" />
      </head>
      <body>Bridge/Swap Success!</body>
    </html>
  `;
}
