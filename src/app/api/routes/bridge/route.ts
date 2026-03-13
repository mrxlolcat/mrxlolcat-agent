import { NextRequest, NextResponse } from 'next/server';
import { catBridge } from '../../../../integrations/lifi/sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Panggil logika SDK LI.FI untuk mendapatkan rute bridge
    const route = await catBridge({
      fid: body.fid || 'anonymous',
      fromChain: body.fromChain,
      toChain: body.toChain,
      fromToken: body.fromToken,
      toToken: body.toToken,
      amount: body.amount,
    });
    
    return NextResponse.json({ success: true, route });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
