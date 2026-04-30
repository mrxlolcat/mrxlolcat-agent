import { createConfig } from '@lifi/sdk';
import { FEE_BPS, DEFAULT_FEE_WALLET } from './constants';

export const lifiConfig = createConfig({
  integrator: 'mrxlolcat-agent',
  // In v3, routeOptions handles fees.
  routeOptions: {
    fee: FEE_BPS / 10000, // 10 BPS -> 0.001 (0.1%)
    feeRecipient: process.env.PARTNER_WALLET_BASE || DEFAULT_FEE_WALLET,
  } as Parameters<typeof createConfig>[0]["routeOptions"]
});
