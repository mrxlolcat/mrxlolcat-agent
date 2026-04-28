"use client";

import { useMemo } from "react";

type Panel = "chat" | "swap" | "lending" | "social" | "launchpad";

const items: { key: Panel; label: string; color: string; dot: string }[] = [
  { key: "chat", label: "AI Agent", color: "text-[var(--accent)]", dot: "bg-[var(--accent)]" },
  { key: "swap", label: "Token Swap", color: "text-[var(--teal)]", dot: "bg-[var(--teal)]" },
  { key: "lending", label: "Lending", color: "text-[#8fa3ff]", dot: "bg-[#8fa3ff]" },
  { key: "launchpad", label: "Launchpad", color: "text-[#d8b46a]", dot: "bg-[#d8b46a]" },
  { key: "social", label: "Social Feed", color: "text-[#ff7fc6]", dot: "bg-[#ff7fc6]" },
];

export default function Sidebar({
  activePanel,
  onSelectPanel,
}: {
  activePanel: Panel;
  onSelectPanel: (panel: Panel) => void;
}) {
  const networkItems = useMemo(
    () => [
      { label: "Base", state: "online" },
      { label: "Ethereum", state: "online" },
    ],
    []
  );

  return (
    <aside className="panel-card flex h-full min-h-[640px] w-full flex-col gap-6 lg:w-[280px]">
      <section>
        <div className="panel-title mb-4">Workspace</div>
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              data-active={activePanel === item.key}
              onClick={() => onSelectPanel(item.key)}
              className="sidebar-item"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
              <span className={item.color}>{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_88%,transparent)] p-4">
        <div className="panel-title mb-4">Network</div>
        <div className="space-y-3">
          {networkItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-2xl border border-[var(--border)] px-3 py-3">
              <div>
                <div className="text-sm font-medium text-[var(--text)]">{item.label}</div>
                <div className="text-xs text-[var(--text-hint)]">Layer 2 / Mainnet</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <span className="h-2 w-2 rounded-full bg-[var(--teal)]" />
                {item.state}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-auto rounded-[22px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_90%,transparent)] p-4 text-sm text-[var(--text-muted)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--teal)]" />
            online
          </div>
          <span className="mono text-xs text-[var(--text-hint)]">v2.1.1</span>
        </div>
      </footer>
    </aside>
  );
}
