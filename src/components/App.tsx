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
    } catch { }
    setReady(true);
  }, []);

  useEffect(() => { init(); }, [init]);

  if (!ready) return null;

  const NavItem = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === id ? 'menu-active text-warden-accent' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="flex h-screen h-[100dvh] bg-black overflow-hidden">
      
      {/* 1. SIDEBAR (Desktop Only) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-warden-border bg-black shrink-0">
        <div className="p-6 mb-4">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.jpg" className="w-8 h-8 rounded-full border border-warden-accent/30" />
            <span className="font-black text-xs tracking-tighter text-white uppercase">MRX <span className="text-warden-accent">LOLCAT</span></span>
          </div>
          
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.2em] mb-4">Main_Modules</p>
            <NavItem id="terminal" label="Agent Terminal" icon="🤖" />
            <NavItem id="bridge" label="Liquidity Bridge" icon="🌉" />
            <Link href="/analytics" className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30 transition-all">
              <span className="text-lg">📊</span> Monitor
            </Link>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-warden-border">
          <button 
            onClick={() => open()}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-warden-border bg-zinc-900/20 hover:border-warden-accent/30 transition-all"
          >
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-warden-accent animate-pulse' : 'bg-zinc-700'}`} />
            <span className="text-[10px] font-mono text-zinc-400 truncate">
              {isConnected ? address?.slice(0, 12) + "..." : "INITIALIZE_KEY"}
            </span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (Mobile Only) */}
        <header className="md:hidden glass border-b border-warden-border flex items-center justify-between px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" className="w-7 h-7 rounded-full border border-warden-accent/30" />
            <h1 className="font-bold text-[10px] uppercase tracking-widest text-white">MRX<span className="text-warden-accent">LOLCAT</span></h1>
          </div>
          <button onClick={() => open()} className="flex items-center gap-2 text-[9px] px-2 py-1.5 rounded-md font-bold border border-warden-border bg-warden-accent/5 text-warden-accent">
            <span className="w-1 h-1 rounded-full bg-warden-accent" />
            {isConnected ? address?.slice(0, 4) + "..." + address?.slice(-3) : "LOGIN"}
          </button>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === "terminal" ? <Chat context={context} /> : <Swap />}
        </div>

        {/* 3. BOTTOM NAV (Mobile Only) */}
        <nav className="md:hidden glass border-t border-warden-border flex items-center justify-center gap-16 py-4 shrink-0">
          <button onClick={() => setActiveTab("terminal")} className={`flex flex-col items-center gap-1 ${activeTab === "terminal" ? "text-warden-accent" : "text-zinc-600"}`}>
            <div className={`w-8 h-1 rounded-full mb-1 transition-all ${activeTab === "terminal" ? "bg-warden-accent shadow-[0_0_15px_rgba(0,240,255,0.6)]" : "bg-transparent"}`} />
            <span className="text-xl">🤖</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Terminal</span>
          </button>
          <button onClick={() => setActiveTab("bridge")} className={`flex flex-col items-center gap-1 ${activeTab === "bridge" ? "text-warden-accent" : "text-zinc-600"}`}>
            <div className={`w-8 h-1 rounded-full mb-1 transition-all ${activeTab === "bridge" ? "bg-warden-accent shadow-[0_0_15px_rgba(0,240,255,0.6)]" : "bg-transparent"}`} />
            <span className="text-xl">🌉</span>
            <span className="text-[9px] font-black uppercase tracking-widest">Bridge</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
