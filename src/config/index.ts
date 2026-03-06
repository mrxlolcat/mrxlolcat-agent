import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  mainnet, base, arbitrum, polygon, optimism,
  bsc, avalanche, zkSync, linea, scroll,
} from "@reown/appkit/networks";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "cb42be53de2e4e4ce8eec9f550e56ff3";

export const networks = [base, mainnet, arbitrum, polygon, optimism, bsc, avalanche, zkSync, linea, scroll];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
