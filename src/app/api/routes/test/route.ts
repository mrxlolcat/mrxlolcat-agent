import { NextRequest, NextResponse } from 'next/server';
import { getRoutes } from '@lifi/sdk';
import '../../../../integrations/lifi/config';
import { CHAINS, TOKENS } from '../../../../integrations/lifi/constants';

export async function GET(req: NextRequest) {
  try {
    const routesResponse = await getRoutes({
      fromChainId: CHAINS.BASE,
      toChainId: CHAINS.OPTIMISM,
      fromTokenAddress: TOKENS.USDC_BASE,
      toTokenAddress: TOKENS.USDC_OP,
      fromAmount: '1000000', // 1 USDC
    });
    
    const routes = routesResponse.routes || [];
    const bestRoute = routes[0];
    
    // Calculate bestRoute amount received (assuming 1 USDC in, looking at what we get out)
    const receiveAmount = bestRoute 
      ? (Number(bestRoute.toAmount) / 10**6).toFixed(3)
      : "0";

    return NextResponse.json({
      success: true,
      routes: routes.length,
      bestRoute: receiveAmount,
      message: `Simulated 1 USDC Base -> OP. Found ${routes.length} routes.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
