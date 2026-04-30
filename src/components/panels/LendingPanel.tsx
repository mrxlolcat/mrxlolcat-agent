"use client";

import Image from "next/image";
import { usePrices } from "@/hooks/usePrices";

const positions = [
  { asset: "ETH", coingeckoId: "ethereum", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", amount: "12.40", apr: "3.8%" },
  { asset: "USDC", coingeckoId: "usd-coin", logo: "https://assets.coingecko.com/coins/images/6319/small/usdc.png", amount: "18,500", apr: "1.9%" },
  { asset: "WBTC", coingeckoId: "wrapped-bitcoin", logo: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png", amount: "0.84", apr: "2.7%" },
];

export default function LendingPanel() {
  const { getPrice, formatPrice, loading } = usePrices(30000);

  return (
    <section className="panel-card flex min-h-[680px] flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="panel-title">Lending</div>
          <h2 className="mt-2 text-2xl font-semibold">Portfolio Health</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Supply, borrow, and rewards summary.</p>
        </div>
        <div className="rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)]">
          health: <span className="text-[var(--teal)] mono font-semibold">2.74</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Supplied", "$112.8K"],
          ["Borrowed", "$42.1K"],
          ["Health Factor", "2.74"],
        ].map(([label, value], i) => (
          <div key={label} className="price-card" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">{label}</div>
            <div className="mt-2 mono text-xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {/* Health bar */}
      <div className="swap-card !p-4">
        <div className="mb-3 flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>Liquidation Risk</span>
          <span className="mono text-[var(--teal)] font-medium">Safe</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--bg-card)_92%,transparent)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--teal)] to-[var(--accent)] transition-all duration-1000"
            style={{ width: "74%" }}
          />
        </div>
      </div>

      {/* Positions table */}
      <div className="overflow-hidden rounded-[22px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_90%,transparent)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">
              <th className="px-5 py-4">Asset</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">APR</th>
              <th className="px-5 py-4">Value</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              const price = getPrice(pos.coingeckoId);
              const numAmount = parseFloat(pos.amount.replace(/,/g, ""));
              const value = price.price * numAmount;

              return (
                <tr key={pos.asset} className="border-b border-[var(--border)] last:border-b-0 transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--accent)_4%,transparent)]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Image src={pos.logo} alt={pos.asset} width={28} height={28} className="token-logo" unoptimized />
                      <span className="font-medium text-[var(--text)]">{pos.asset}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 mono text-[var(--text-muted)]">{pos.amount}</td>
                  <td className="px-5 py-4 mono text-[var(--teal)]">{pos.apr}</td>
                  <td className="px-5 py-4 mono text-[var(--text-muted)]">
                    {loading ? <span className="skeleton h-4 w-16 inline-block rounded" /> : formatPrice(value)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
