"use client";

import { useState } from "react";
import Image from "next/image";
import { useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useWalletData } from "@/hooks/useWalletData";
import type { Panel } from "./Sidebar";

export default function Navbar({
  activePanel,
  onSelectPanel,
  onToggleSidebar,
}: {
  activePanel: Panel;
  onSelectPanel: (panel: Panel) => void;
  onToggleSidebar: () => void;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { address, isConnected, chain, nativeBalance, totalUSD, formatPrice } = useWalletData();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const toggleTheme = () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") || theme;
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    setTheme(next);
  };

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const tabs: { key: Panel; label: string }[] = [
    { key: "chat", label: "Chat" },
    { key: "prices", label: "Markets" },
    { key: "swap", label: "Swap" },
    { key: "deploy", label: "Deploy" },
    { key: "lending", label: "Lending" },
  ];

  return (
    <header className="glass-panel sticky top-0 z-30 border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 lg:px-6">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn-icon h-9 w-9 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-md lg:hidden">
            <Image src="/logo.jpeg" alt="mrxlolcat" fill className="object-cover" />
          </div>
          <span className="text-sm font-bold text-[var(--text)] lg:hidden">mrxlolcat</span>
        </div>

        {/* Desktop tabs */}
        <nav className="hidden flex-1 items-center justify-center gap-1.5 lg:flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              data-active={activePanel === tab.key}
              onClick={() => onSelectPanel(tab.key)}
              className="nav-pill"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right section */}
        <div className="ml-auto flex items-center gap-2">
          {/* DashScope badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--accent)] sm:flex">
            <span className="status-dot bg-[var(--accent)]" />
            Qwen
          </div>

          {/* Network indicator */}
          {isConnected && chain && (
            <div className="hidden items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)] md:flex animate-fade-in">
              <span className="status-dot bg-[var(--teal)]" />
              {chain.name}
            </div>
          )}

          {/* Connect wallet / Address */}
          {isConnected ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_80%,transparent)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-all duration-200 hover:border-[var(--border-strong)] hover:shadow-md"
              >
                <span className="h-5 w-5 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--teal)] animate-pulse-glow" />
                <div className="flex flex-col items-start">
                  <span className="mono">{shortAddress}</span>
                  {totalUSD > 0 && (
                    <span className="text-[10px] text-[var(--text-muted)]">{formatPrice(totalUSD)}</span>
                  )}
                </div>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className={`transition-transform duration-200 ${showWalletMenu ? "rotate-180" : ""}`}>
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </button>

              {showWalletMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowWalletMenu(false)} />
                  <div className="dropdown-menu absolute right-0 top-full z-50 mt-2 w-64">
                    {/* Balance overview */}
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-hint)]">Portfolio Value</div>
                      <div className="mt-1 text-lg font-bold mono">{formatPrice(totalUSD)}</div>
                      {nativeBalance && (
                        <div className="mt-1 text-xs text-[var(--text-muted)]">
                          {Number(nativeBalance.formatted).toFixed(4)} {nativeBalance.symbol}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => { open(); setShowWalletMenu(false); }}
                      className="dropdown-item"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                      Wallet Details
                    </button>
                    <button
                      type="button"
                      onClick={() => { disconnect(); setShowWalletMenu(false); }}
                      className="dropdown-item text-[var(--red)]"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Disconnect
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button type="button" onClick={() => open()} className="btn-connect">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 10h20" />
                <circle cx="18" cy="15" r="1.5" fill="currentColor" />
              </svg>
              Connect
            </button>
          )}

          {/* Theme toggle */}
          <button type="button" onClick={toggleTheme} className="btn-icon h-9 w-9 text-xs">
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </div>
    </header>
  );
}
