import { createConfig } from '@lifi/sdk';

// Initialize the global configuration for LI.FI SDK
// This configuration will be used automatically by getRoutes, executeRoute, etc.
export const lifiConfig = createConfig({
  integrator: 'mrxlolcat-agent',
  // Use public key if needed on client side or private key on server side
  apiKey: process.env.LIFI_API_KEY || process.env.NEXT_PUBLIC_LIFI_API_KEY, 
  routeOptions: {
    fee: 0.001, // 0.1% (FEE_BPS=10 -> 0.001 as decimal multiplier based on SDK behavior)
    feeRecipient: process.env.PARTNER_WALLET_BASE || '0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5',
  } as any
});
