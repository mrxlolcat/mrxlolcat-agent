"use client";

import Image from "next/image";
import { CHAIN_META, CHAINS } from "@/configs/constants";
import { useWalletData } from "@/hooks/useWalletData";

export type Panel = "chat" | "swap" | "lending" | "deploy" | "prices";

const navItems: { key: Panel; label: string; icon: string }[] = [
  { key: "chat", label: "AI Agent", icon: "M" },
  { key: "prices", label: "Markets", icon: "$" },
  { key: "swap", label: "Token Swap", icon: "S" },
  { key: "deploy", label: "Deploy Token", icon: "D" },
  { key: "lending", label: "Lending", icon: "L" },
];

const activeChains = [CHAINS.BASE, CHAINS.ETHEREUM, CHAINS.ARBITRUM, CHAINS.OPTIMISM, CHAINS.POLYGON, CHAINS.BSC, CHAINS.AVALANCHE];

export default function Sidebar({
  activePanel,
  onSelectPanel,
  isOpen,
  onClose,
}: {
  activePanel: Panel;
  onSelectPanel: (panel: Panel) => void;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const { isConnected, address, tokenBalances, totalUSD, formatPrice, loading } = useWalletData();

  return (
    <>
      {isOpen && (
        <div className="overlay-backdrop fixed inset-0 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[var(--border)] bg-[var(--bg-surface)] transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-lg">
            <Image src="/logo.jpeg" alt="mrxlolcat" fill className="object-cover" />
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--text)]">mrxlolcat</div>
            <div className="text-[11px] text-[var(--text-hint)]">AI Agent on Base</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-hint)]">
            Workspace
          </div>
          <div className="space-y-1">
            {navItems.map((item, i) => (
              <button
                key={item.key}
                type="button"
                data-active={activePanel === item.key}
                onClick={() => {
                  onSelectPanel(item.key);
                  onClose?.();
                }}
                className="sidebar-item group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-card)] text-xs font-bold text-[var(--text-muted)] transition-all duration-200 group-hover:bg-[var(--accent)] group-hover:text-white group-data-[active=true]:bg-[var(--accent)] group-data-[active=true]:text-white">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Wallet Balances */}
          {isConnected && (
            <div className="mt-6 animate-fade-in">
              <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-hint)]">
                Wallet
              </div>
              <div className="mx-2 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_60%,transparent)] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-hint)]">Total Value</span>
                  {loading && <span className="h-3 w-3 animate-spin rounded-full border border-[var(--accent)] border-t-transparent" />}
                </div>
                <div className="mt-1 text-lg font-bold mono text-[var(--text)]">
                  {totalUSD > 0 ? formatPrice(totalUSD) : "$0.00"}
                </div>
                {address && (
                  <div className="mt-1 mono text-[10px] text-[var(--text-hint)]">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                )}
                {tokenBalances.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {tokenBalances.slice(0, 5).map((tb) => (
                      <div key={tb.symbol} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Image src={tb.logoUrl} alt={tb.symbol} width={16} height={16} className="rounded-full" unoptimized />
                          <span className="font-medium text-[var(--text)]">{tb.symbol}</span>
                        </div>
                        <div className="text-right">
                          <div className="mono text-[var(--text)]">{tb.balance}</div>
                          {tb.usdValue > 0 && (
                            <div className="mono text-[10px] text-[var(--text-hint)]">{formatPrice(tb.usdValue)}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Networks */}
          <div className="mt-6 mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-hint)]">
            Networks
          </div>
          <div className="flex flex-wrap gap-1.5 px-2">
            {activeChains.map((chainId) => {
              const chain = CHAIN_META[chainId];
              if (!chain) return null;
              return (
                <span key={chainId} className="chain-badge" title={chain.name}>
                  <Image
                    src={chain.logoUrl}
                    alt={chain.name}
                    width={14}
                    height={14}
                    className="rounded-full"
                    unoptimized
                  />
                  <span>{chain.shortName}</span>
                </span>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-5 py-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="status-dot bg-[var(--teal)]" />
              DashScope Online
            </div>
            <span className="mono text-[var(--text-hint)]">v3.2.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
