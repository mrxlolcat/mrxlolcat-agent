import { getRoutes, executeRoute } from '@lifi/sdk';
import './config'; // Ensures global config is loaded

export interface BridgeParams {
  fromChain: number;
  toChain: number;
  fromToken: string;
  toToken: string;
  amount: string;
}

export async function getBestRoute({
  fromChain, 
  toChain, 
  fromToken, 
  toToken, 
  amount
}: BridgeParams) {
  // We no longer need to pass options manually because they are set in the global config!
  const routesResponse = await getRoutes({
    fromChainId: fromChain,
    toChainId: toChain,
    fromTokenAddress: fromToken,
    toTokenAddress: toToken,
    fromAmount: amount,
  });
  
  if (!routesResponse.routes || routesResponse.routes.length === 0) {
    throw new Error('No valid routes found');
  }

  // Best route automatically placed at index 0 by LI.FI API
  return routesResponse.routes[0];
}

// Additional helper for direct execution (e.g., inside an API or Node context)
export async function executeBestRoute(route: any) {
  // Execute the route (this usually requires a signer/wallet to be passed in real scenarios)
  // This is a placeholder for the agent's logic.
  return await executeRoute(route);
}
