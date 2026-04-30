"use client";

import { useState } from "react";

type Panel = "chat" | "swap" | "lending" | "bridge";

interface SidebarProps {
  activePanel: Panel;
  onSelectPanel: (panel: Panel) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { key: Panel; label: string; icon: React.ReactNode }[] = [
  {
    key: "chat",
    label: "AI Chat",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    key: "swap",
    label: "Token Swap",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
  },
  {
    key: "bridge",
    label: "Bridge",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h5m10 0h5M7 12a5 5 0 0 1 10 0" />
        <circle cx="7" cy="12" r="2" />
        <circle cx="17" cy="12" r="2" />
      </svg>
    ),
  },
  {
    key: "lending",
    label: "Lending",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
];

const chatHistory = [
  { id: "1", title: "Cross-chain bridge ETH to Base", time: "Today" },
  { id: "2", title: "Check wallet balance", time: "Today" },
  { id: "3", title: "Swap USDC to ETH on Uniswap", time: "Today" },
  { id: "4", title: "Hashing strategies with LI.FI", time: "Previous 7 Days" },
  { id: "5", title: "Navigate DeFi lending protocols", time: "Previous 7 Days" },
  { id: "6", title: "MCP protocol explanation", time: "Previous 7 Days" },
  { id: "7", title: "Mobile app concept with Farcaster", time: "Previous 7 Days" },
];

export default function Sidebar({ activePanel, onSelectPanel, isOpen, onClose }: SidebarProps) {
  const [model] = useState("Qwen Plus");

  const todayChats = chatHistory.filter((c) => c.time === "Today");
  const olderChats = chatHistory.filter((c) => c.time === "Previous 7 Days");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar-root fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-[var(--border)] bg-[var(--bg-surface)] transition-transform duration-200 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header: Logo + New Chat */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-xs font-black text-white">
              M
            </div>
            <span className="text-sm font-semibold text-[var(--text)]">mrxlolcat</span>
          </div>
          <button
            type="button"
            onClick={() => onSelectPanel("chat")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition hover:bg-[var(--bg-card)] hover:text-[var(--text)]"
            title="New chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Model indicator */}
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--teal)]" />
          <span>{model}</span>
          <span className="ml-auto text-[var(--text-hint)]">DashScope</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5 px-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              data-active={activePanel === item.key}
              onClick={() => {
                onSelectPanel(item.key);
                onClose();
              }}
              className="sidebar-nav-item"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mx-4 my-3 border-t border-[var(--border)]" />

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3">
          {todayChats.length > 0 && (
            <div className="mb-3">
              <div className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-widest text-[var(--text-hint)]">
                Today
              </div>
              {todayChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  className="sidebar-history-item"
                  onClick={() => {
                    onSelectPanel("chat");
                    onClose();
                  }}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          )}

          {olderChats.length > 0 && (
            <div className="mb-3">
              <div className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-widest text-[var(--text-hint)]">
                Previous 7 Days
              </div>
              {olderChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  className="sidebar-history-item"
                  onClick={() => {
                    onSelectPanel("chat");
                    onClose();
                  }}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border)] p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-[var(--bg-card)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
              H
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium text-[var(--text)]">Hasim</div>
              <div className="text-[11px] text-[var(--text-hint)]">v3.2.0</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-hint)]">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </div>
        </div>
      </aside>
    </>
  );
}
