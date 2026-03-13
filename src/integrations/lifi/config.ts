import { createConfig } from '@lifi/sdk';

export const lifiConfig = createConfig({
  integrator: 'mrxlolcat-agent',
  // In v3, routeOptions handles fees. BPS 10 = 0.001 (0.1%)
  routeOptions: {
    fee: 0.001,
    feeRecipient: process.env.PARTNER_WALLET_BASE || '0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5',
  } as any
});
