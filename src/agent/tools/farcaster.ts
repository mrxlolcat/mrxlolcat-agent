import { NeynarAPIClient } from "@neynar/nodejs-sdk";

export function getNeynarClient() {
  if (!process.env.NEYNAR_API_KEY) {
    return null;
  }
  return new NeynarAPIClient({ apiKey: process.env.NEYNAR_API_KEY });
}

export async function publishCast(text: string, embeds?: { url: string }[]) {
  const neynar = getNeynarClient();
  if (!neynar || !process.env.FARCASTER_SIGNER_UUID) {
    throw new Error("Neynar API Key or Signer UUID not configured");
  }

  try {
    const result = await neynar.publishCast({
      signerUuid: process.env.FARCASTER_SIGNER_UUID,
      text: text,
      embeds: embeds,
    });
    const castResult = result as { hash?: string; cast?: { hash?: string } };
    return { success: true, hash: castResult.hash || castResult.cast?.hash };
  } catch (error) {
    console.error("[Neynar Cast Error]:", error);
    return { success: false, error };
  }
}

export async function publishThankYouCast(sender: string, amount: string, txHash: string) {
  const text = `Meow! 😻 Huge thanks to ${sender.slice(0, 6)}...${sender.slice(-4)} for tipping ${amount} USDC to the mrxlolcat-agent dev fund! 🐾✨\n\nTX: ${txHash.slice(0, 10)}... (Base)\n\nTry the agent mini-app now!`;

  // We add an embed URL that points to our TTS engine to generate a voice cast
  const ttsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/tts?text=Meow!+Thanks+for+the+tip!`;

  return await publishCast(text, [{ url: ttsUrl }]);
}
