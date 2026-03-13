import { NextRequest, NextResponse } from 'next/server';
import { getRoutes } from '@lifi/sdk';
import '../../../../configs/lifi'; // Pastikan config global di-load
import { CHAINS, TOKENS } from '../../../../configs/constants';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const fromChain = Number(searchParams.get('fromChain')) || CHAINS.BASE;
  const toChain = Number(searchParams.get('toChain')) || CHAINS.BASE; // Same chain for swap
  const fromToken = searchParams.get('fromToken') || TOKENS.USDC_BASE;
  const toToken = searchParams.get('toToken') || TOKENS.ETH_BASE;
  const amount = searchParams.get('amount') || '1000000'; // Default 1 USDC

  try {
    const routesResponse = await getRoutes({
      fromChainId: fromChain,
      toChainId: toChain,
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      fromAmount: amount,
    });
    
    return NextResponse.json(routesResponse);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
