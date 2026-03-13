/**
 * Integrasi Wallet spesifik untuk Base dan interaksi Farcaster Mini App
 */
import { useAccount } from "wagmi";

export function useBaseWallet() {
  const { address, isConnected, chain } = useAccount();

  const isBase = chain?.id === 8453 || chain?.id === 84532; // Base Mainnet or Sepolia

  return {
    address,
    isConnected,
    isBase,
    chainName: chain?.name || "Unknown",
  };
}
