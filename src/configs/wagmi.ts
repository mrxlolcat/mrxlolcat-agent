import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  base, mainnet, arbitrum, polygon, optimism,
  bsc, avalanche, zkSync, linea, scroll,
} from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b5681c42340910519165288653703e26";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [base, mainnet, arbitrum, polygon, optimism, bsc, avalanche, zkSync, linea, scroll];

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
});
