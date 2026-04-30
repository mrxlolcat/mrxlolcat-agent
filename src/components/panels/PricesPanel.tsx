"use client";

import Image from "next/image";
import { usePrices } from "@/hooks/usePrices";
import { POPULAR_TOKENS } from "@/configs/constants";

export default function PricesPanel() {
  const { loading, getPrice, formatPrice, formatChange, lastUpdated, refetch } = usePrices(15000);

  return (
    <section className="panel-card flex min-h-[680px] flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="panel-title">Markets</div>
          <h2 className="mt-2 text-2xl font-semibold">Live Crypto Prices</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Real-time prices from CoinGecko. Auto-refresh every 15s.
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          className="btn-secondary px-3 py-1.5 text-xs"
          title="Refresh prices"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={loading ? "animate-spin-slow" : ""}
          >
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "Loading..."}
        </button>
      </div>

      {/* Price cards grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {POPULAR_TOKENS.map((token, i) => {
          const data = getPrice(token.coingeckoId);
          const isUp = data.change24h >= 0;

          return (
            <div
              key={token.symbol}
              className="price-card group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={token.logoUrl}
                    alt={token.symbol}
                    width={36}
                    height={36}
                    className="token-logo"
                    unoptimized
                  />
                  <div>
                    <div className="font-semibold text-[var(--text)]">{token.symbol}</div>
                    <div className="text-xs text-[var(--text-hint)]">{token.name}</div>
                  </div>
                </div>
                <div
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isUp ? "bg-[rgba(29,158,117,0.12)] text-[var(--teal)]" : "bg-[rgba(239,68,68,0.12)] text-[var(--red)]"
                  }`}
                >
                  {loading ? "..." : formatChange(data.change24h)}
                </div>
              </div>

              <div className="mt-3">
                {loading ? (
                  <div className="skeleton h-8 w-24" />
                ) : (
                  <div className="mono text-xl font-bold text-[var(--text)]">
                    {formatPrice(data.price)}
                  </div>
                )}
                {data.marketCap > 0 && (
                  <div className="mt-1 text-xs text-[var(--text-hint)]">
                    MCap: ${(data.marketCap / 1e9).toFixed(1)}B
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
