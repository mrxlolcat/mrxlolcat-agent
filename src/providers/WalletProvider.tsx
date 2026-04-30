"use client";

import { wagmiAdapter, projectId } from "@/configs/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import {
  base, mainnet, arbitrum, polygon, optimism,
  bsc, avalanche, zkSync, linea, scroll,
} from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

const metadata = {
  name: "mrxlolcat-agent",
  description: "AI Agent with Swap, Launchpad, Social & Lending",
  url: "https://mrxlolcat-agent.vercel.app",
  icons: ["https://mrxlolcat-agent.vercel.app/icon.png"],
};

createAppKit({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapters: [wagmiAdapter as any],
  projectId,
  networks: [base, mainnet, arbitrum, polygon, optimism, bsc, avalanche, zkSync, linea, scroll],
  defaultNetwork: base,
  metadata,
  features: {
    analytics: true,
    swaps: true,
    onramp: true,
    send: true,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#6366F1",
    "--w3m-color-mix": "#09090B",
    "--w3m-color-mix-strength": 40,
    "--w3m-border-radius-master": "1.5px",
  },
});

export default function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
