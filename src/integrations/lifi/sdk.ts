import { getRoutes, executeRoute } from '@lifi/sdk';
import { lifiConfig } from './config';

export interface BridgeParams {
  fid: string;
  fromChain?: number;
  toChain?: number;
  fromToken?: string;
  toToken?: string;
  amount?: string;
}

export async function catBridge({
  fid, 
  fromChain = 8453, // Base
  toChain = 10,     // Optimism
  fromToken = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC Base
  toToken = '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC OP
  amount = '1000000' // 1 USDC
}: BridgeParams) {
  
  // OFFICIAL LI.FI route logic using the globally initialized config
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

  const bestRoute = routesResponse.routes[0];
  
  // Return the route. In a real scenario, this would be passed to `executeRoute(bestRoute)`
  // after getting a signer from the user's wallet via wagmi.
  return bestRoute;
}
