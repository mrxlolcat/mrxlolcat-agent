"use client";

import { useAccount, useBalance } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import { POPULAR_TOKENS, CHAINS, CHAIN_META } from "@/configs/constants";
import { usePrices } from "./usePrices";

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
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);

  const chainId = chain?.id || CHAINS.BASE;

  const fetchERC20Balances = useCallback(async () => {
    if (!address || !isConnected) {
      setTokenBalances([]);
      return;
    }

    setLoading(true);
    const results: TokenBalance[] = [];

    // Native balance
    if (nativeBalance) {
      const ethPrice = getPrice("ethereum");
      const nativeFormatted = Number(nativeBalance.formatted);
      results.push({
        symbol: nativeBalance.symbol,
        name: CHAIN_META[chainId]?.nativeCurrency || "ETH",
        balance: nativeFormatted.toFixed(6),
        balanceRaw: nativeBalance.value,
        decimals: nativeBalance.decimals,
        logoUrl: POPULAR_TOKENS[0].logoUrl,
        usdValue: nativeFormatted * ethPrice.price,
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
              const formatted = Number(rawBalance) / 10 ** token.decimals;
              const price = getPrice(token.coingeckoId);
              return {
                symbol: token.symbol,
                name: token.name,
                balance: formatted.toFixed(token.decimals === 18 ? 6 : 2),
                balanceRaw: rawBalance,
                decimals: token.decimals,
                logoUrl: token.logoUrl,
                usdValue: formatted * price.price,
                chainId,
              } as TokenBalance;
            }
          }
          return null;
        } catch {
          return null;
        }
      });

      const settled = await Promise.all(calls);
      const validBalances = settled.filter((b): b is TokenBalance => b !== null);
      results.push(...validBalances);
    }

    setTokenBalances(results);
    setLoading(false);
  }, [address, isConnected, chainId, nativeBalance, getPrice]);

  useEffect(() => {
    fetchERC20Balances();
  }, [fetchERC20Balances]);

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
      fetchERC20Balances();
    },
  };
}


