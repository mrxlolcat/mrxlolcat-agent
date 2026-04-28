"use client";

import { useMemo, useState } from "react";

const routes = [
  { dex: "Uniswap", fee: "0.05%", label: "best" },
  { dex: "Curve", fee: "0.08%", label: "stable" },
  { dex: "1inch", fee: "0.12%", label: "aggregated" },
];

export default function SwapPanel() {
  const [amount, setAmount] = useState("1.0");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken] = useState("USDC");

  const output = useMemo(() => {
    const value = Number(amount || 0);
    if (Number.isNaN(value)) return "0.00";
    return (value * 3240 * 0.996).toFixed(2);
  }, [amount]);

  return (
    <section className="panel-card flex min-h-[680px] flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="panel-title">Token Swap</div>
          <h2 className="mt-2 text-2xl font-semibold">ETH → USDC</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Realtime output estimation dan route DEX terbaik.</p>
        </div>
        <div className="rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)] mono">
          1 ETH ≈ $3,240
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["ETH price", "$3,240.12"],
          ["Gas", "18 gwei"],
          ["Liquidity", "$42.8M"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[22px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_90%,transparent)] p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">{label}</div>
            <div className="mt-2 mono text-xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_90%,transparent)] p-5">
        <div className="grid gap-3 md:grid-cols-[1.2fr,auto,1.2fr] md:items-center">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">From</label>
            <div className="flex gap-2">
              <select value={fromToken} onChange={(e) => setFromToken(e.target.value)} className="input-field mono md:max-w-[120px]">
                <option>ETH</option>
                <option>WETH</option>
                <option>USDC</option>
              </select>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field mono" inputMode="decimal" />
            </div>
          </div>

          <button type="button" className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)]">
            ⇅
          </button>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">To</label>
            <div className="flex gap-2">
              <select value={toToken} disabled className="input-field mono md:max-w-[120px] opacity-80">
                <option>USDC</option>
              </select>
              <input value={output} readOnly className="input-field mono" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-muted)]">
          <span className="mono">Estimated route: Base → Uniswap V3 → USDC</span>
          <button type="button" className="btn-primary px-5 py-2">Review swap</button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {routes.map((route) => (
          <div key={route.dex} className="rounded-[22px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_92%,transparent)] p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{route.dex}</div>
              <span className="rounded-full border border-[var(--border)] px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--text-hint)]">{route.label}</span>
            </div>
            <div className="mt-3 mono text-sm text-[var(--text-muted)]">Fee: {route.fee}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
