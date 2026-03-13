import { publishCast } from '../src/agent/tools/farcaster';

/**
 * Example: Automated Social Interaction
 * This script demonstrates how the agent publishes a "Thank You" cast
 * to Farcaster after a successful user interaction.
 */
async function runSocialExample() {
  console.log('[example] Initiating social cast workflow...');
  
  const castText = "Meow! 🤠 Just processed a high-speed bridge for a fellow cat. The Agentic Economy is thriving! 🐾✨";
  
  try {
    // In a real scenario, this requires FARCASTER_SIGNER_UUID in .env
    const result = await publishCast(castText);

    if (result.success) {
      console.log(`[example] Cast published successfully! Hash: ${result.hash}`);
    } else {
      console.log('[example] Cast failed (check API keys).');
    }
  } catch (error) {
    console.error('[example] Workflow error:', error);
  }
}

runSocialExample();
