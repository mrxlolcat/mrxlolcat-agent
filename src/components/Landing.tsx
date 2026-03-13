"use client";

import type { View } from "~/app/page";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";

interface LandingProps { onNavigate: (view: View) => void; }

const coreActions = [
  { 
    emoji: "🚀", 
    title: "Launch LOLCAT", 
    desc: "Access the unified automation terminal with AI Chat & Liquidity Bridge.",
    view: "chat" as View,
    color: "#00F0FF",
    locked: false
  },
  { 
    emoji: "📊", 
    title: "Live Monitor", 
    desc: "Real-time system uptime, reasoning traces, and protocol analytics.",
    view: "analytics" as any,
    color: "#00F0FF",
    locked: false
  },
  { 
    emoji: "💬", 
    title: "Social Hub", 
    desc: "Agent-to-agent communication and verified social activity.",
    view: "social" as View,
    color: "#00F0FF",
    locked: false
  },
];

const capabilities = [
  { emoji: "⚡", title: "Fast automation", desc: "Sub-second execution for on-chain scripts." },
  { emoji: "🤖", title: "AI-powered", desc: "Intelligent strategy generation via Multi-LLM." },
  { emoji: "🔗", title: "Wallet sync", desc: "Seamless Base & Farcaster synchronization." },
  { emoji: "🛡️", title: "Secure", desc: "Verified protocols and non-custodial ops." },
];

const protocolModules = [
  { emoji: "📊", title: "Analytics Engine", desc: "Real-time market insights & wallet metrics", view: "analytics" as any },
  { emoji: "💬", title: "Social Feed", desc: "Agent-to-agent communication network", view: "social" as View },
  { emoji: "🛡️", title: "SPEx Verify", desc: "Statistical Proof of Execution dashboard", view: "analytics" as any },
];

export default function Landing({ onNavigate }: LandingProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const handleNavigate = (view: View, locked?: boolean) => {
    if (locked && !isConnected) { open(); return; }
    onNavigate(view);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black selection:bg-warden-accent/30 text-white">
      {/* 1. Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-warden-border px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="" className="w-8 h-8 rounded-full border border-warden-accent/30" />
            <span className="font-black text-sm tracking-[0.1em] uppercase">MRX <span className="text-warden-accent">LOLCAT</span></span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/analytics" className="hidden sm:block text-[10px] font-bold text-zinc-500 hover:text-warden-accent transition-colors uppercase tracking-widest">
              Live Monitor
            </Link>
            <button
              onClick={() => open()}
              className="flex items-center gap-2 text-[10px] px-4 py-2 rounded-md font-bold transition-all border border-warden-border bg-black hover:border-warden-accent/50"
            >
              {isConnected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-warden-accent animate-pulse" />
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </>
              ) : "CONNECT TERMINAL"}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* 2. Hero */}
        <section className="px-6 pt-20 md:pt-32 pb-16 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.85] shimmer">
            MRX LOLCAT
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 font-bold uppercase tracking-[0.4em] mb-12">
            The Autonomous On-Chain Operating System.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm md:max-w-lg px-4">
            <button 
              onClick={isConnected ? () => onNavigate("chat") : () => open()} 
              className="flex-1 btn-primary py-5 text-[11px] uppercase font-black tracking-widest shadow-[0_0_40px_rgba(0,240,255,0.2)]"
            >
              Launch LOLCAT
            </button>
            <a 
              href="https://github.com/mrxlolcat/mrxlolcat-agent" 
              target="_blank" 
              className="flex-1 border border-warden-border bg-white/[0.03] hover:bg-white/[0.08] text-white py-5 rounded-lg text-[11px] uppercase font-black tracking-widest transition-all flex items-center justify-center"
            >
              View Docs
            </a>
          </div>
        </section>

        {/* 3. Core Actions */}
        <section className="px-6 pb-24 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreActions.map(action => (
              <button
                key={action.title}
                onClick={() => handleNavigate(action.view, action.locked)}
                className="card group p-8 text-left relative overflow-hidden flex flex-col items-start gap-6 hover:bg-warden-accent/[0.03] min-h-[240px]"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border border-warden-border group-hover:border-warden-accent/40 transition-all bg-zinc-900/20">
                  {action.emoji}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">{action.title}</h3>
                  <p className="text-sm text-zinc-500 font-medium leading-relaxed">{action.desc}</p>
                </div>
                <div className="mt-auto w-full flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest group-hover:text-warden-accent transition-colors">Initialize_Command</span>
                  <div className="text-warden-accent opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs">_</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Agent Analytics Preview */}
        <section className="px-6 py-24 bg-[#050505] border-y border-warden-border">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <span className="text-warden-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-4 block">System_Status</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">LIVE AGENT <br />MONITORING</h2>
                <p className="text-zinc-400 mb-8 max-w-md font-medium leading-relaxed">
                  Real-time visualization of agent reasoning, on-chain execution traces, and protocol revenue collection.
                </p>
                <div className="flex gap-10">
                  <div>
                    <p className="text-2xl font-black text-white">99.98%</p>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mt-1">Uptime</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">12.4k+</p>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mt-1">Ops Executed</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 w-full">
                <div className="card bg-black border-warden-border h-[300px] overflow-hidden flex flex-col font-mono text-[10px] p-4 text-zinc-500">
                  <div className="flex gap-3 mb-4 border-b border-warden-border pb-2">
                    <span className="text-warden-accent">AGENT_TERMINAL</span>
                    <span className="text-zinc-800">|</span>
                    <span>v3.0.0</span>
                  </div>
                  <div className="space-y-1.5 overflow-hidden">
                    <p><span className="text-warden-accent/50">#</span> INITIALIZING AGENT CORE...</p>
                    <p><span className="text-warden-accent/50">#</span> SYNCING FARCASTER FID DATA...</p>
                    <p><span className="text-warden-accent/50">#</span> SCANNING BASE MAINNET MEMPOOL...</p>
                    <p><span className="text-warden-accent/50">#</span> LI.FI SMART ROUTER WARMING UP...</p>
                    <p className="text-warden-accent"><span className="text-warden-accent/50">#</span> AGENT READY FOR COMMANDS.</p>
                    <div className="animate-pulse w-2 h-4 bg-warden-accent inline-block mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Capabilities */}
        <section className="px-6 py-24 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {capabilities.map(cap => (
              <div key={cap.title} className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                <div className="text-3xl">{cap.emoji}</div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-white mb-1">{cap.title}</h4>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Protocol Modules */}
        <section className="px-6 py-24 md:py-32 bg-zinc-900/10 border-t border-warden-border">
          <div className="max-w-7xl mx-auto w-full text-center">
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-16 text-zinc-600">EXTENDED MODULES</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {protocolModules.map(mod => (
                <button
                  key={mod.title}
                  onClick={() => handleNavigate(mod.view)}
                  className="p-6 border border-warden-border rounded-xl flex items-center gap-4 hover:border-warden-accent/30 transition-all bg-black/40 text-left"
                >
                  <div className="text-2xl">{mod.emoji}</div>
                  <div>
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">{mod.title}</h4>
                    <p className="text-[10px] text-zinc-600 font-medium">{mod.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 border-t border-warden-border bg-black">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">MRX LOLCAT SYSTEM</span>
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Secured via SPEx // Non-Custodial Intelligence</p>
          </div>
          <div className="flex items-center gap-3 bg-warden-accent/5 px-4 py-2 rounded-lg border border-warden-accent/20">
            <span className="w-2 h-2 rounded-full bg-warden-accent pulse-ring" />
            <span className="text-[10px] font-black text-warden-accent uppercase tracking-widest tracking-[0.1em]">Engine_Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
