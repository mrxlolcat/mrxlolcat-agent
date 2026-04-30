"use client";

import { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { usePrices } from "@/hooks/usePrices";
import { POPULAR_TOKENS, CHAIN_META, CHAINS } from "@/configs/constants";

const swapChains = [CHAINS.BASE, CHAINS.ETHEREUM, CHAINS.ARBITRUM, CHAINS.OPTIMISM, CHAINS.POLYGON, CHAINS.BSC, CHAINS.AVALANCHE];

const routes = [
  { dex: "Uniswap V3", fee: "0.05%", label: "best", logo: "https://assets.coingecko.com/coins/images/12504/small/uni.png" },
  { dex: "SushiSwap", fee: "0.08%", label: "stable", logo: "https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png" },
  { dex: "1inch", fee: "0.12%", label: "aggregated", logo: "https://assets.coingecko.com/coins/images/13469/small/1inch-token.png" },
];

export default function SwapPanel() {
  const [amount, setAmount] = useState("1.0");
  const [fromTokenIdx, setFromTokenIdx] = useState(0); // ETH
  const [toTokenIdx, setToTokenIdx] = useState(1); // USDC
  const [selectedChain, setSelectedChain] = useState<number>(CHAINS.BASE);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const { getPrice, formatPrice, loading: priceLoading } = usePrices(15000);

  const fromToken = POPULAR_TOKENS[fromTokenIdx];
  const toToken = POPULAR_TOKENS[toTokenIdx];
  const fromPrice = getPrice(fromToken.coingeckoId);
  const toPrice = getPrice(toToken.coingeckoId);

  const output = useMemo(() => {
    const value = Number(amount || 0);
    if (Number.isNaN(value) || value === 0 || !fromPrice.price || !toPrice.price) return "0.00";
    const result = (value * fromPrice.price) / (toPrice.price || 1);
    return result.toFixed(toToken.decimals === 18 ? 6 : 2);
  }, [amount, fromPrice.price, toPrice.price, toToken.decimals]);

  const handleSwapDirection = useCallback(() => {
    setFromTokenIdx(toTokenIdx);
    setToTokenIdx(fromTokenIdx);
  }, [fromTokenIdx, toTokenIdx]);

  const selectFromToken = useCallback((idx: number) => {
    if (idx === toTokenIdx) setToTokenIdx(fromTokenIdx);
    setFromTokenIdx(idx);
    setShowFromDropdown(false);
  }, [fromTokenIdx, toTokenIdx]);

  const selectToToken = useCallback((idx: number) => {
    if (idx === fromTokenIdx) setFromTokenIdx(toTokenIdx);
    setToTokenIdx(idx);
    setShowToDropdown(false);
  }, [fromTokenIdx, toTokenIdx]);

  return (
    <section className="panel-card flex min-h-[680px] flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="panel-title">Token Swap</div>
          <h2 className="mt-2 text-2xl font-semibold">
            {fromToken.symbol} → {toToken.symbol}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Multi-chain swap with best route selection.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)] mono">
          {priceLoading ? (
            <span className="skeleton h-4 w-24 rounded-lg" />
          ) : (
            <>1 {fromToken.symbol} ≈ {formatPrice(fromPrice.price)}</>
          )}
        </div>
      </div>

      {/* Chain selector */}
      <div className="flex flex-wrap gap-1.5">
        {swapChains.map((chainId) => {
          const chain = CHAIN_META[chainId];
          if (!chain) return null;
          return (
            <button
              key={chainId}
              type="button"
              onClick={() => setSelectedChain(chainId)}
              className={`chain-badge cursor-pointer ${selectedChain === chainId ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--bg-card))]" : ""}`}
            >
              <Image src={chain.logoUrl} alt={chain.name} width={14} height={14} className="rounded-full" unoptimized />
              <span>{chain.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Price cards */}
      <div className="grid gap-3 md:grid-cols-3">
        {[
          [fromToken.symbol + " price", priceLoading ? "..." : formatPrice(fromPrice.price)],
          ["Gas (est.)", "0.001 ETH"],
          [toToken.symbol + " price", priceLoading ? "..." : formatPrice(toPrice.price)],
        ].map(([label, value], i) => (
          <div key={label} className="price-card" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">{label}</div>
            <div className="mt-2 mono text-xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {/* Swap form */}
      <div className="swap-card">
        <div className="grid gap-4 md:grid-cols-[1fr,auto,1fr] md:items-end">
          {/* From */}
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">From</label>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowFromDropdown(!showFromDropdown); setShowToDropdown(false); }}
                  className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-3 text-sm font-medium transition-all duration-200 hover:border-[var(--border-strong)]"
                >
                  <Image src={fromToken.logoUrl} alt={fromToken.symbol} width={22} height={22} className="rounded-full" unoptimized />
                  {fromToken.symbol}
                  <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-200 ${showFromDropdown ? "rotate-180" : ""}`}>
                    <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </button>
                {showFromDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFromDropdown(false)} />
                    <div className="dropdown-menu absolute left-0 top-full z-20 mt-1 w-52 max-h-64 overflow-y-auto">
                      {POPULAR_TOKENS.map((t, idx) => (
                        <button key={t.symbol} type="button" onClick={() => selectFromToken(idx)} className="dropdown-item">
                          <Image src={t.logoUrl} alt={t.symbol} width={20} height={20} className="rounded-full" unoptimized />
                          <span className="font-medium">{t.symbol}</span>
                          <span className="ml-auto text-xs text-[var(--text-hint)]">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field mono"
                inputMode="decimal"
                placeholder="0.0"
              />
            </div>
            {fromPrice.price > 0 && (
              <div className="mt-1.5 px-1 text-xs text-[var(--text-hint)]">
                ≈ {formatPrice(Number(amount || 0) * fromPrice.price)}
              </div>
            )}
          </div>

          {/* Swap arrow */}
          <button
            type="button"
            onClick={handleSwapDirection}
            className="swap-arrow-btn mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)]"
          >
            ⇅
          </button>

          {/* To */}
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">To</label>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowToDropdown(!showToDropdown); setShowFromDropdown(false); }}
                  className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-3 text-sm font-medium transition-all duration-200 hover:border-[var(--border-strong)]"
                >
                  <Image src={toToken.logoUrl} alt={toToken.symbol} width={22} height={22} className="rounded-full" unoptimized />
                  {toToken.symbol}
                  <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-200 ${showToDropdown ? "rotate-180" : ""}`}>
                    <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </button>
                {showToDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowToDropdown(false)} />
                    <div className="dropdown-menu absolute left-0 top-full z-20 mt-1 w-52 max-h-64 overflow-y-auto">
                      {POPULAR_TOKENS.map((t, idx) => (
                        <button key={t.symbol} type="button" onClick={() => selectToToken(idx)} className="dropdown-item">
                          <Image src={t.logoUrl} alt={t.symbol} width={20} height={20} className="rounded-full" unoptimized />
                          <span className="font-medium">{t.symbol}</span>
                          <span className="ml-auto text-xs text-[var(--text-hint)]">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <input value={output} readOnly className="input-field mono" />
            </div>
            {toPrice.price > 0 && (
              <div className="mt-1.5 px-1 text-xs text-[var(--text-hint)]">
                ≈ {formatPrice(Number(output || 0) * toPrice.price)}
              </div>
            )}
          </div>
        </div>

        {/* Route info */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Image src={CHAIN_META[selectedChain]?.logoUrl || ""} alt="" width={16} height={16} className="rounded-full" unoptimized />
            <span className="mono">{CHAIN_META[selectedChain]?.name} → Uniswap V3 → {toToken.symbol}</span>
          </div>
          <button type="button" className="btn-primary px-5 py-2">Review Swap</button>
        </div>
      </div>

      {/* Route options */}
      <div className="grid gap-3 md:grid-cols-3">
        {routes.map((route, i) => (
          <div key={route.dex} className="price-card group cursor-pointer" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src={route.logo} alt={route.dex} width={24} height={24} className="rounded-full" unoptimized />
                <div className="font-semibold">{route.dex}</div>
              </div>
              <span className="rounded-full border border-[var(--border)] px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--text-hint)]">
                {route.label}
              </span>
            </div>
            <div className="mt-3 mono text-sm text-[var(--text-muted)]">Fee: {route.fee}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
