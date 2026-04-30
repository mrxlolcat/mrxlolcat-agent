"use client";

import { useState, useEffect, useCallback } from "react";

interface PriceData {
  price: number;
  change24h: number;
  marketCap: number;
}

interface PriceState {
  prices: Record<string, PriceData>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export function usePrices(refreshInterval = 30000) {
  const [state, setState] = useState<PriceState>({
    prices: {},
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      setState({
        prices: data.prices || {},
        loading: false,
        error: data.error || null,
        lastUpdated: data.timestamp || Date.now(),
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: "Network error" }));
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPrices, refreshInterval]);

  const getPrice = useCallback(
    (coingeckoId: string): PriceData => {
      return state.prices[coingeckoId] || { price: 0, change24h: 0, marketCap: 0 };
    },
    [state.prices]
  );

  const formatPrice = useCallback((price: number): string => {
    if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  }, []);

  const formatChange = useCallback((change: number): string => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  }, []);

  return { ...state, getPrice, formatPrice, formatChange, refetch: fetchPrices };
}
