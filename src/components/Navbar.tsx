"use client";

import { useState } from "react";

type Panel = "chat" | "swap" | "lending" | "social" | "launchpad";

export default function Navbar({
  activePanel,
  onSelectPanel,
}: {
  activePanel: Panel;
  onSelectPanel: (panel: Panel) => void;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") || theme;
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    setTheme(next);
  };

  const tabs: { key: Panel; label: string }[] = [
    { key: "chat", label: "Chat" },
    { key: "swap", label: "Swap" },
    { key: "lending", label: "Lending" },
    { key: "social", label: "Social" },
    { key: "launchpad", label: "Launchpad" },
  ];

  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-black text-white shadow-[0_10px_30px_rgba(127,119,221,0.35)]">
            AI
          </div>
          <div>
            <div className="text-sm font-semibold leading-none">mrxlolcat.agent</div>
            <div className="mt-1 text-xs text-[var(--text-hint)]">Futuristic on-chain workspace</div>
          </div>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-2 md:flex">
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

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[var(--teal)] shadow-[0_0_12px_rgba(29,158,117,0.8)]" />
            online
          </div>
          <div className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text)]">
            wallet
          </div>
          <div className="hidden rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--accent)] sm:block">
            DashScope
          </div>
          <button type="button" onClick={toggleTheme} className="btn-secondary px-3 py-2 text-xs">
            Theme {theme === "dark" ? "◐" : "◑"}
          </button>
        </div>
      </div>
    </header>
  );
}
