import { getHistory } from '../src/agent/memory/manager';

/**
 * Example: Wallet & Context Monitoring
 * This script demonstrates how the agent retrieves historical context
 * for a specific user (FID) to provide personalized monitoring.
 */
async function runMonitorExample() {
  const fid = "29488"; // User's Farcaster ID
  console.log(`[example] Monitoring context for FID: ${fid}...`);
  
  try {
    // Retrieves last 5 interactions from Pinecone Vector Memory
    const history = await getHistory(fid, 5);

    if (history.length > 0) {
      console.log(`[example] Found ${history.length} recent events in memory.`);
      history.forEach((msg, i) => {
        console.log(`  ${i+1}. [${msg.role}] ${msg.content?.slice(0, 50)}...`);
      });
    } else {
      console.log('[example] No previous interactions found. Starting fresh monitor.');
    }
  } catch (error) {
    console.error('[example] Monitoring failed:', error);
  }
}

runMonitorExample();
