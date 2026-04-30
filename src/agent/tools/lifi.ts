import { getRoutes } from '@lifi/sdk';
import '../../configs/lifi';
import { CHAINS, TOKENS } from '../../configs/constants';

export interface BridgeParams {
  fid: string;
  fromChain?: number;
  toChain?: number;
  fromToken?: string;
  toToken?: string;
  amount?: string;
}

export async function catBridge({
  fromChain = CHAINS.BASE,
  toChain = CHAINS.OPTIMISM,
  fromToken = TOKENS.USDC_BASE,
  toToken = TOKENS.USDC_OP,
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
