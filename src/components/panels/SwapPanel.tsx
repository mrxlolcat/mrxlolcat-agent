"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { usePrices } from "@/hooks/usePrices";
import { POPULAR_TOKENS, CHAIN_META, CHAINS } from "@/configs/constants";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

const swapChains = [CHAINS.BASE, CHAINS.ETHEREUM, CHAINS.ARBITRUM, CHAINS.OPTIMISM, CHAINS.POLYGON, CHAINS.BSC, CHAINS.AVALANCHE];

interface LifiRoute {
  id: string;
  fromAmountUSD: string;
  toAmountUSD: string;
  toAmount: string;
  gasCostUSD: string;
  steps: {
    toolDetails: { name: string; logoURI: string };
    estimate: { executionDuration: number; gasCosts?: { amountUSD?: string }[] };
    action: { fromToken: { symbol: string }; toToken: { symbol: string } };
  }[];
  tags?: string[];
}

export default function SwapPanel() {
  const [amount, setAmount] = useState("1.0");
  const [fromTokenIdx, setFromTokenIdx] = useState(0);
  const [toTokenIdx, setToTokenIdx] = useState(1);
  const [selectedChain, setSelectedChain] = useState<number>(CHAINS.BASE);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [lifiRoutes, setLifiRoutes] = useState<LifiRoute[]>([]);
  const [quoteFetching, setQuoteFetching] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const { getPrice, formatPrice, loading: priceLoading } = usePrices(15000);
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  const fromToken = POPULAR_TOKENS[fromTokenIdx];
  const toToken = POPULAR_TOKENS[toTokenIdx];
  const fromPrice = getPrice(fromToken.coingeckoId);
  const toPrice = getPrice(toToken.coingeckoId);

  const fromAddress = fromToken.addresses[selectedChain];
  const toAddress = toToken.addresses[selectedChain];

  const fetchQuote = useCallback(async () => {
    const parsedAmount = Number(amount || 0);
    if (parsedAmount <= 0 || !fromAddress || !toAddress) {
      setLifiRoutes([]);
      return;
    }
    setQuoteFetching(true);
    setQuoteError("");
    try {
      const fromAmountWei = BigInt(Math.floor(parsedAmount * 10 ** fromToken.decimals)).toString();
      const res = await fetch(
        `/api/routes/swap?fromChain=${selectedChain}&toChain=${selectedChain}&fromToken=${fromAddress}&toToken=${toAddress}&amount=${fromAmountWei}`
      );
      const data = await res.json();
      if (data.error) {
        setQuoteError(data.error);
        setLifiRoutes([]);
      } else if (data.routes && data.routes.length > 0) {
        setLifiRoutes(data.routes.slice(0, 3));
        setSelectedRouteIdx(0);
      } else {
        setQuoteError("No routes found for this pair");
        setLifiRoutes([]);
      }
    } catch {
      setQuoteError("Failed to fetch quote");
      setLifiRoutes([]);
    } finally {
      setQuoteFetching(false);
    }
  }, [amount, fromAddress, toAddress, selectedChain, fromToken.decimals]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuote();
    }, 800);
    return () => clearTimeout(timer);
  }, [fetchQuote]);

  const output = useMemo(() => {
    if (lifiRoutes.length > 0 && lifiRoutes[selectedRouteIdx]) {
      const route = lifiRoutes[selectedRouteIdx];
      const raw = BigInt(route.toAmount);
      const result = Number(raw) / 10 ** toToken.decimals;
      return result.toFixed(toToken.decimals === 18 ? 6 : 2);
    }
    const value = Number(amount || 0);
    if (Number.isNaN(value) || value === 0 || !fromPrice.price || !toPrice.price) return "0.00";
    const result = (value * fromPrice.price) / (toPrice.price || 1);
    return result.toFixed(toToken.decimals === 18 ? 6 : 2);
  }, [amount, fromPrice.price, toPrice.price, toToken.decimals, lifiRoutes, selectedRouteIdx]);

  const handleSwapDirection = useCallback(() => {
    setFromTokenIdx(toTokenIdx);
    setToTokenIdx(fromTokenIdx);
    setLifiRoutes([]);
  }, [fromTokenIdx, toTokenIdx]);

  const selectFromToken = useCallback((idx: number) => {
    if (idx === toTokenIdx) setToTokenIdx(fromTokenIdx);
    setFromTokenIdx(idx);
    setShowFromDropdown(false);
    setLifiRoutes([]);
  }, [fromTokenIdx, toTokenIdx]);

  const selectToToken = useCallback((idx: number) => {
    if (idx === fromTokenIdx) setFromTokenIdx(toTokenIdx);
    setToTokenIdx(idx);
    setShowToDropdown(false);
    setLifiRoutes([]);
  }, [fromTokenIdx, toTokenIdx]);

  const bestRoute = lifiRoutes[selectedRouteIdx];
  const gasCostUSD = bestRoute?.gasCostUSD ? `$${Number(bestRoute.gasCostUSD).toFixed(2)}` : "—";

  return (
    <section className="panel-card flex min-h-[680px] flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="panel-title">Token Swap</div>
          <h2 className="mt-2 text-2xl font-semibold">
            {fromToken.symbol} → {toToken.symbol}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Real-time routing via LI.FI aggregator.
          </p>
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
              onClick={() => { setSelectedChain(chainId); setLifiRoutes([]); }}
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
          ["Gas (est.)", quoteFetching ? "..." : gasCostUSD],
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
                      {POPULAR_TOKENS.filter((t) => t.addresses[selectedChain]).map((t) => {
                        const idx = POPULAR_TOKENS.indexOf(t);
                        return (
                          <button key={t.symbol} type="button" onClick={() => selectFromToken(idx)} className="dropdown-item">
                            <Image src={t.logoUrl} alt={t.symbol} width={20} height={20} className="rounded-full" unoptimized />
                            <span className="font-medium">{t.symbol}</span>
                            <span className="ml-auto text-xs text-[var(--text-hint)]">{t.name}</span>
                          </button>
                        );
                      })}
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
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">To (estimated)</label>
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
                      {POPULAR_TOKENS.filter((t) => t.addresses[selectedChain]).map((t) => {
                        const idx = POPULAR_TOKENS.indexOf(t);
                        return (
                          <button key={t.symbol} type="button" onClick={() => selectToToken(idx)} className="dropdown-item">
                            <Image src={t.logoUrl} alt={t.symbol} width={20} height={20} className="rounded-full" unoptimized />
                            <span className="font-medium">{t.symbol}</span>
                            <span className="ml-auto text-xs text-[var(--text-hint)]">{t.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              <input value={quoteFetching ? "..." : output} readOnly className="input-field mono" />
            </div>
            {toPrice.price > 0 && !quoteFetching && (
              <div className="mt-1.5 px-1 text-xs text-[var(--text-hint)]">
                ≈ {formatPrice(Number(output || 0) * toPrice.price)}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        {quoteFetching && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] px-4 py-3 text-sm text-[var(--text-muted)] animate-fade-in">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            Fetching best routes from LI.FI...
          </div>
        )}

        {quoteError && !quoteFetching && (
          <div className="mt-4 rounded-2xl border border-[var(--red)]/20 bg-[color-mix(in_srgb,var(--red)_6%,transparent)] px-4 py-3 text-sm text-[var(--red)] animate-fade-in">
            {quoteError}
          </div>
        )}

        {!fromAddress || !toAddress ? (
          <div className="mt-4 rounded-2xl border border-[var(--orange)]/20 bg-[color-mix(in_srgb,var(--orange)_6%,transparent)] px-4 py-3 text-sm text-[var(--orange)] animate-fade-in">
            {fromToken.symbol} or {toToken.symbol} not available on {CHAIN_META[selectedChain]?.name}. Select a different chain or token.
          </div>
        ) : null}

        {/* Execute button */}
        <div className="mt-4 flex items-center justify-between gap-3">
          {bestRoute && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-hint)]">
              {bestRoute.steps.map((step, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span>→</span>}
                  <Image src={step.toolDetails.logoURI} alt={step.toolDetails.name} width={16} height={16} className="rounded-full" unoptimized />
                  <span>{step.toolDetails.name}</span>
                </span>
              ))}
              <span className="text-[var(--text-hint)]">
                (~{Math.ceil((bestRoute.steps[0]?.estimate.executionDuration || 30) / 60)}min)
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => { if (!isConnected) open(); }}
            disabled={!fromAddress || !toAddress || quoteFetching || lifiRoutes.length === 0}
            className="btn-primary ml-auto px-6 py-2.5"
          >
            {!isConnected ? "Connect Wallet to Swap" : lifiRoutes.length > 0 ? "Review Swap" : "Enter Amount"}
          </button>
        </div>
      </div>

      {/* Live routes from LI.FI */}
      {lifiRoutes.length > 0 && (
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-hint)]">
            Live Routes from LI.FI ({lifiRoutes.length})
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {lifiRoutes.map((route, i) => {
              const step = route.steps[0];
              const tags = route.tags || [];
              return (
                <button
                  key={route.id || i}
                  type="button"
                  onClick={() => setSelectedRouteIdx(i)}
                  className={`price-card cursor-pointer text-left transition-all duration-200 ${selectedRouteIdx === i ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--bg-card))]" : ""}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {step && (
                        <Image src={step.toolDetails.logoURI} alt={step.toolDetails.name} width={24} height={24} className="rounded-full" unoptimized />
                      )}
                      <div className="font-semibold text-sm">{step?.toolDetails.name || "Route"}</div>
                    </div>
                    {tags.includes("RECOMMENDED") && (
                      <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase text-white">Best</span>
                    )}
                    {tags.includes("CHEAPEST") && (
                      <span className="rounded-full bg-[var(--teal)] px-2 py-0.5 text-[10px] font-bold uppercase text-white">Cheapest</span>
                    )}
                    {tags.includes("FASTEST") && (
                      <span className="rounded-full bg-[var(--orange)] px-2 py-0.5 text-[10px] font-bold uppercase text-white">Fastest</span>
                    )}
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
                    <div className="flex justify-between">
                      <span>Output</span>
                      <span className="mono font-medium text-[var(--text)]">
                        {(Number(route.toAmount) / 10 ** toToken.decimals).toFixed(toToken.decimals === 18 ? 6 : 2)} {toToken.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas cost</span>
                      <span className="mono">${Number(route.gasCostUSD || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time</span>
                      <span className="mono">~{Math.ceil((step?.estimate.executionDuration || 30) / 60)}min</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
