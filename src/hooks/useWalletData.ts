"use client";

import { useAccount, useBalance } from "wagmi";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { POPULAR_TOKENS, CHAINS, CHAIN_META } from "@/configs/constants";
import { usePrices } from "./usePrices";

const NATIVE_TOKEN_MAP: Record<number, { coingeckoId: string; logoUrl: string }> = {
  [CHAINS.BASE]: { coingeckoId: "ethereum", logoUrl: POPULAR_TOKENS[0].logoUrl },
  [CHAINS.ETHEREUM]: { coingeckoId: "ethereum", logoUrl: POPULAR_TOKENS[0].logoUrl },
  [CHAINS.OPTIMISM]: { coingeckoId: "ethereum", logoUrl: POPULAR_TOKENS[0].logoUrl },
  [CHAINS.ARBITRUM]: { coingeckoId: "ethereum", logoUrl: POPULAR_TOKENS[0].logoUrl },
  [CHAINS.ZKSYNC]: { coingeckoId: "ethereum", logoUrl: POPULAR_TOKENS[0].logoUrl },
  [CHAINS.LINEA]: { coingeckoId: "ethereum", logoUrl: POPULAR_TOKENS[0].logoUrl },
  [CHAINS.SCROLL]: { coingeckoId: "ethereum", logoUrl: POPULAR_TOKENS[0].logoUrl },
  [CHAINS.BSC]: { coingeckoId: "binancecoin", logoUrl: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
  [CHAINS.POLYGON]: { coingeckoId: "matic-network", logoUrl: "https://assets.coingecko.com/coins/images/4713/small/polygon.png" },
  [CHAINS.AVALANCHE]: { coingeckoId: "avalanche-2", logoUrl: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png" },
};

interface RawBalance {
  symbol: string;
  name: string;
  balanceRaw: bigint;
  decimals: number;
  logoUrl: string;
  coingeckoId: string;
  chainId: number;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceRaw: bigint;
  decimals: number;
  logoUrl: string;
  usdValue: number;
  chainId: number;
}

export function useWalletData() {
  const { address, isConnected, chain } = useAccount();
  const { data: nativeBalance, refetch: refetchNative } = useBalance({
    address,
  });
  const { getPrice, formatPrice } = usePrices(15000);
  const getPriceRef = useRef(getPrice);
  getPriceRef.current = getPrice;

  const [rawBalances, setRawBalances] = useState<RawBalance[]>([]);
  const [loading, setLoading] = useState(false);

  const chainId = chain?.id || CHAINS.BASE;

  const fetchBalances = useCallback(async () => {
    if (!address || !isConnected) {
      setRawBalances([]);
      return;
    }

    setLoading(true);
    const results: RawBalance[] = [];

    // Native balance
    if (nativeBalance) {
      const nativeInfo = NATIVE_TOKEN_MAP[chainId] || NATIVE_TOKEN_MAP[CHAINS.ETHEREUM];
      results.push({
        symbol: nativeBalance.symbol,
        name: CHAIN_META[chainId]?.nativeCurrency || "ETH",
        balanceRaw: nativeBalance.value,
        decimals: nativeBalance.decimals,
        logoUrl: nativeInfo.logoUrl,
        coingeckoId: nativeInfo.coingeckoId,
        chainId,
      });
    }

    // Fetch ERC-20 balances via RPC
    const rpcUrl = CHAIN_META[chainId]?.rpcUrl;
    if (rpcUrl) {
      const erc20Tokens = POPULAR_TOKENS.filter(
        (t) => t.addresses[chainId] && t.addresses[chainId] !== "0x0000000000000000000000000000000000000000"
      );

      const calls = erc20Tokens.map(async (token) => {
        const tokenAddress = token.addresses[chainId];
        if (!tokenAddress) return null;
        try {
          const data = `0x70a08231000000000000000000000000${address.slice(2).toLowerCase()}`;
          const res = await fetch(rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "eth_call",
              params: [{ to: tokenAddress, data }, "latest"],
            }),
          });
          const json = await res.json();
          if (json.result && json.result !== "0x" && json.result !== "0x0") {
            const rawBalance = BigInt(json.result);
            if (rawBalance > BigInt(0)) {
              return {
                symbol: token.symbol,
                name: token.name,
                balanceRaw: rawBalance,
                decimals: token.decimals,
                logoUrl: token.logoUrl,
                coingeckoId: token.coingeckoId,
                chainId,
              } as RawBalance;
            }
          }
          return null;
        } catch {
          return null;
        }
      });

      const settled = await Promise.all(calls);
      const validBalances = settled.filter((b): b is RawBalance => b !== null);
      results.push(...validBalances);
    }

    setRawBalances(results);
    setLoading(false);
  }, [address, isConnected, chainId, nativeBalance]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Compute USD values separately so price updates don't re-fetch balances
  const tokenBalances = useMemo<TokenBalance[]>(() => {
    return rawBalances.map((rb) => {
      const formatted = Number(rb.balanceRaw) / 10 ** rb.decimals;
      const price = getPriceRef.current(rb.coingeckoId);
      return {
        symbol: rb.symbol,
        name: rb.name,
        balance: formatted.toFixed(rb.decimals === 18 ? 6 : 2),
        balanceRaw: rb.balanceRaw,
        decimals: rb.decimals,
        logoUrl: rb.logoUrl,
        usdValue: formatted * price.price,
        chainId: rb.chainId,
      };
    });
  }, [rawBalances, getPrice]);

  const totalUSD = tokenBalances.reduce((sum, t) => sum + t.usdValue, 0);

  return {
    address,
    isConnected,
    chain,
    chainId,
    nativeBalance,
    tokenBalances,
    totalUSD,
    loading,
    formatPrice,
    refetch: () => {
      refetchNative();
      fetchBalances();
    },
  };
}
