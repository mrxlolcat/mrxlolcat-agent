"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import Chat from "./Chat";
import Swap from "./Swap";

export default function App() {
  const [ready, setReady] = useState(false);
  const [context, setContext] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"terminal" | "bridge" | "analytics">("terminal");
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const init = useCallback(async () => {
    try {
      const ctx = await sdk.context;
      setContext(ctx);
      await sdk.actions.ready();
    } catch (error) {
      console.warn("Farcaster context is unavailable:", error);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  if (!ready) return null;

  const NavItem = ({ id, label, icon }: { id: typeof activeTab; label: string; icon: string }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
        activeTab === id
          ? "bg-warden-accent/10 text-warden-accent"
          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-transparent">
      <div className="flex min-h-screen flex-col overflow-visible md:flex-row">
        <aside className="hidden md:flex w-64 flex-col border-r border-warden-border bg-black/80 shrink-0 backdrop-blur-xl">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" className="w-8 h-8 rounded-full border border-warden-accent/30" alt="MRX LOLCAT" />
              <span className="text-xs font-black uppercase tracking-tighter text-white">
                MRX <span className="text-warden-accent">LOLCAT</span>
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Main Modules</p>
              <NavItem id="terminal" label="Agent Terminal" icon="🤖" />
              <NavItem id="bridge" label="Liquidity Bridge" icon="🌉" />
              <Link
                href="/analytics"
                className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
              >
                <span className="text-lg">📊</span>
                Monitor
              </Link>
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-warden-border">
            <button
              type="button"
              onClick={() => open()}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-warden-border bg-zinc-900/20 hover:border-warden-accent/30 transition-all"
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-warden-accent animate-pulse" : "bg-zinc-700"}`} />
              <span className="text-[10px] font-mono text-zinc-400 truncate">
                {isConnected ? `${address?.slice(0, 12)}...` : "INITIALIZE_KEY"}
              </span>
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col min-w-0">
          <header className="md:hidden glass border-b border-warden-border flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" className="w-7 h-7 rounded-full border border-warden-accent/30" alt="Logo" />
              <h1 className="text-[10px] font-black uppercase tracking-widest text-white">
                MRX <span className="text-warden-accent">LOLCAT</span>
              </h1>
            </div>
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center gap-2 rounded-md border border-warden-border bg-warden-accent/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] transition-all"
            >
              <span className="w-1 h-1 rounded-full bg-warden-accent" />
              {isConnected ? `${address?.slice(0, 4)}...${address?.slice(-3)}` : "LOGIN"}
            </button>
          </header>

          <main className="flex-1 overflow-auto bg-black/40 px-0 md:px-0">
            <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-black/50 p-4 shadow-2xl md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live Preview</p>
                  <h2 className="text-2xl font-black text-white">Command Center</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                  <span className={`h-2 w-2 rounded-full ${activeTab === "terminal" ? "bg-emerald-400" : "bg-slate-700"}`} />
                  {activeTab === "terminal" ? "Terminal" : "Bridge"}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("terminal")}
                  className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    activeTab === "terminal"
                      ? "border-emerald-400 text-white"
                      : "border-slate-700 text-slate-500"
                  }`}
                >
                  Terminal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("bridge")}
                  className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    activeTab === "bridge"
                      ? "border-emerald-400 text-white"
                      : "border-slate-700 text-slate-500"
                  }`}
                >
                  Social & Bridge
                </button>
              </div>

              <div className="mt-6 min-h-[28rem] overflow-hidden rounded-3xl border border-slate-800 bg-black/60">
                {activeTab === "terminal" ? <Chat context={context} /> : <Swap />}
              </div>
            </div>
          </main>

          <nav className="md:hidden glass border-t border-warden-border flex items-center justify-evenly gap-6 px-4 py-4">
            <button
              type="button"
              onClick={() => setActiveTab("terminal")}
              className={`flex flex-col items-center gap-1 ${
                activeTab === "terminal" ? "text-warden-accent" : "text-zinc-500"
              }`}
            >
              <div
                className={`w-8 h-1 rounded-full transition-all ${
                  activeTab === "terminal"
                    ? "bg-warden-accent shadow-[0_0_15px_rgba(0,240,255,0.6)]"
                    : "bg-transparent"
                }`}
              />
              <span className="text-xl">🤖</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Terminal</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bridge")}
              className={`flex flex-col items-center gap-1 ${
                activeTab === "bridge" ? "text-warden-accent" : "text-zinc-500"
              }`}
            >
              <div
                className={`w-8 h-1 rounded-full transition-all ${
                  activeTab === "bridge"
                    ? "bg-warden-accent shadow-[0_0_15px_rgba(0,240,255,0.6)]"
                    : "bg-transparent"
                }`}
              />
              <span className="text-xl">🌉</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Bridge</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
