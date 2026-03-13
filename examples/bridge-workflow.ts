import { catBridge } from '../src/agent/tools/lifi';

/**
 * Example: Programmatic Bridging
 * This script demonstrates how to use the LI.FI tool to find a route
 * for bridging 100 USDC from Base to Optimism.
 */
async function runExample() {
  console.log('[example] Initializing bridge workflow...');
  
  try {
    const route = await catBridge({
      fid: '1234', // Example Farcaster ID
      fromChain: 8453, // Base
      toChain: 10,     // Optimism
      amount: '100000000', // 100 USDC (6 decimals)
    });

    console.log('[example] Best route found!');
    console.log(`[example] Estimated receive amount: ${Number(route.toAmount) / 10**6} USDC`);
    console.log(`[example] Route steps: ${route.steps.length}`);
  } catch (error) {
    console.error('[example] Workflow failed:', error);
  }
}

runExample();
