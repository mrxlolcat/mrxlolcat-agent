"use client";

import type { View } from "~/app/page";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";

interface LandingProps { onNavigate: (view: View) => void; }

const features = [
  { emoji: "🤖", title: "AI Agent", desc: "Natural language interactions with long-term memory", view: "chat" as View, color: "#00F0FF" },
  { emoji: "🌉", title: "Bridge", desc: "Omnichain asset transfers via LI.FI Smart Routing", view: "bridge" as View, color: "#00F0FF", locked: true },
  { emoji: "💬", title: "Social", desc: "Real-time agent social feed & network discovery", view: "social" as View, color: "#00F0FF" },
];

export default function Landing({ onNavigate }: LandingProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const handleNavigate = (view: View, locked?: boolean) => {
    if (locked && !isConnected) { open(); return; }
    onNavigate(view);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-black selection:bg-warden-accent/30">
      {/* Nav */}
      <nav className="glass sticky top-0 z-50 border-b border-warden-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤠</span>
            <span className="font-bold text-sm tracking-tight text-white uppercase">Warden<span className="text-warden-accent">Cat</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/analytics" className="text-[10px] font-bold text-zinc-500 hover:text-warden-accent transition-colors uppercase tracking-widest">
              Analytics
            </Link>
            <button
              onClick={() => open()}
              className="flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-md font-bold transition-all border border-warden-border hover:border-warden-accent/50"
              style={isConnected ? {
                background: "rgba(0, 240, 255, 0.05)",
                color: "#00F0FF",
              } : {
                background: "#00F0FF",
                color: "black",
              }}
            >
              {isConnected ? (
                <>
                  <span className="w-1 h-1 rounded-full bg-warden-accent animate-pulse" />
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </>
              ) : "Initialize"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-12 pb-10 text-center flex flex-col items-center">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-warden-accent/20 blur-3xl rounded-full transition-opacity group-hover:bg-warden-accent/30" />
          <div className="relative w-24 h-24 rounded-full border border-warden-accent/30 flex items-center justify-center text-5xl bg-black/50 backdrop-blur-xl">
            🤠
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-warden-accent flex items-center justify-center text-[12px] border-4 border-black text-black font-bold animate-fade-in">
            ✓
          </div>
        </div>
        
        <h1 className="text-3xl font-black mb-3 tracking-tighter text-white uppercase">
          Agentic <span className="gradient-text">Economy</span>
        </h1>
        <p className="text-[12px] text-zinc-500 leading-relaxed max-w-[280px] font-medium uppercase tracking-wide">
          The high-tech interface for cross-chain liquidity and AI intelligence on Farcaster.
        </p>

        {/* Technical Stats */}
        <div className="grid grid-cols-3 gap-1 mt-10 w-full border-y border-warden-border py-6">
          {[
            { v: "60+", l: "Chains" },
            { v: "0.1%", l: "Fee" },
            { v: "SPEx", l: "Verified" },
          ].map(s => (
            <div key={s.l} className="text-center px-2">
              <p className="text-xs font-mono font-bold text-warden-accent">{s.v}</p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Primary Action */}
      <section className="px-6 pb-6">
        <button 
          onClick={isConnected ? () => onNavigate("bridge") : () => open()} 
          className="w-full btn-primary py-4 text-xs shadow-[0_0_30px_rgba(0,240,255,0.1)]"
        >
          {isConnected ? "Execute Cross-Chain Bridge" : "Connect Access Key"}
        </button>
      </section>

      {/* Feature Grid */}
      <section className="px-6 pb-10 flex-1 w-full max-w-sm mx-auto">
        <div className="space-y-3">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 text-center">Available Modules</p>
          {features.map(f => {
            const needsWallet = f.locked && !isConnected;
            return (
              <button
                key={f.title}
                onClick={() => handleNavigate(f.view, f.locked)}
                className="card w-full p-5 text-left group flex items-center gap-5 hover:bg-warden-accent/[0.02]"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 border border-warden-border group-hover:border-warden-accent/30 transition-colors bg-zinc-900/30">
                  {f.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-[12px] text-white uppercase tracking-tight">{f.title}</h3>
                    {f.locked && <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-zinc-900 text-zinc-500 border border-zinc-800 uppercase font-black tracking-widest">Locked</span>}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium leading-normal">{f.desc}</p>
                </div>
                <div className="text-warden-accent opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs">
                  {">"}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-8 border-t border-warden-border pt-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Protocol Version</span>
            <span className="text-[10px] font-mono text-zinc-500">v3.0.0-PROD</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-md border border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-warden-accent pulse-ring" />
            <span className="text-[9px] font-bold text-warden-accent uppercase">Mainnet Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
