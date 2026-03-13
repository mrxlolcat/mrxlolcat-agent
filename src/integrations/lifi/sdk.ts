import { createConfig, getRoutes } from '@lifi/sdk';

// Initialize LI.FI SDK globally
createConfig({
  integrator: 'mrxlolcat-agent',
  apiUrl: 'https://li.fi/api/v1'
});

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
  const options = {
    fee: 0.01, // 1% fee for the fee wallet
    feeRecipient: '0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5',
  };

  const routesResponse = await getRoutes({
    fromChainId: fromChain,
    toChainId: toChain,
    fromTokenAddress: fromToken,
    toTokenAddress: toToken,
    fromAmount: amount,
    options,
  });
  
  if (routesResponse.routes.length === 0) {
    throw new Error('No valid routes found');
  }

  // Best route otomatis ditaruh di index 0 oleh LI.FI
  return routesResponse.routes[0];
}
