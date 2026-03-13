import { NextRequest, NextResponse } from 'next/server';
import { catBridge } from '../../../../integrations/lifi/sdk';

export async function GET(req: NextRequest) {
  try {
    // Tes simulasi default: Bridge 10 USDC dari Base ke OP
    const route = await catBridge({
      fid: 'test-user-123',
      amount: '10000000', // 10 USDC
    });
    
    return NextResponse.json({
      success: true,
      message: "Test LI.FI: 10 USDC Base → OP simulated successfully",
      routeInfo: {
        fromChainId: route.fromChainId,
        toChainId: route.toChainId,
        estimatedExecutionTime: route.steps[0]?.estimate?.executionDuration || 'Unknown',
        feeRecipient: route.steps[0]?.estimate?.feeCosts?.[0]?.amount || 'Check global config'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
