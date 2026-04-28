"use client";

const positions = [
  { asset: "ETH", amount: "12.40", apr: "3.8%", value: "$40,128" },
  { asset: "USDC", amount: "18,500", apr: "1.9%", value: "$18,500" },
  { asset: "wBTC", amount: "0.84", apr: "2.7%", value: "$53,220" },
];

export default function LendingPanel() {
  return (
    <section className="panel-card flex min-h-[680px] flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="panel-title">Lending</div>
          <h2 className="mt-2 text-2xl font-semibold">Portfolio health</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Ringkasan posisi supply, borrow, dan rewards.</p>
        </div>
        <div className="rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)]">
          health factor: <span className="text-[var(--teal)] mono">2.74</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Supplied", "$112.8K"],
          ["Borrowed", "$42.1K"],
          ["Health", "2.74"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[22px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_90%,transparent)] p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">{label}</div>
            <div className="mt-2 mono text-xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_90%,transparent)] p-5">
        <div className="mb-3 flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>Health bar</span>
          <span className="mono text-[var(--teal)]">Safe</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--bg-card)_92%,transparent)]">
          <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-[var(--teal)] to-[var(--accent)]" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_90%,transparent)]">
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
            {positions.map((position) => (
              <tr key={position.asset} className="border-b border-[var(--border)] last:border-b-0">
                <td className="px-5 py-4 font-medium text-[var(--text)]">{position.asset}</td>
                <td className="px-5 py-4 mono text-[var(--text-muted)]">{position.amount}</td>
                <td className="px-5 py-4 mono text-[var(--text-muted)]">{position.apr}</td>
                <td className="px-5 py-4 mono text-[var(--text-muted)]">{position.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
