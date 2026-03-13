import { NeynarAPIClient } from "@neynar/nodejs-sdk";

export function getNeynarClient() {
  if (!process.env.NEYNAR_API_KEY) {
    return null;
  }
  return new NeynarAPIClient({ apiKey: process.env.NEYNAR_API_KEY });
}

export async function publishThankYouCast(sender: string, amount: string, txHash: string) {
  const neynar = getNeynarClient();
  if (!neynar || !process.env.FARCASTER_SIGNER_UUID) {
    console.warn("Neynar keys not set. Skipping cast.");
    return { success: true, warning: "keys_missing" };
  }

  const text = `Meow! 😻 Huge thanks to ${sender.slice(0, 6)}...${sender.slice(-4)} for tipping ${amount} USDC to the mrxlolcat-agent dev fund! 🐾✨\n\nTX: ${txHash.slice(0, 10)}... (Base)\n\nTry the agent mini-app now!`;

  try {
    await neynar.publishCast({
      signerUuid: process.env.FARCASTER_SIGNER_UUID,
      text: text,
    });
    return { success: true };
  } catch (error) {
    console.error("[Neynar Cast Error]:", error);
    return { success: false, error };
  }
}
