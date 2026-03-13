"use client";

import type { View } from "~/app/page";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";

interface LandingProps { onNavigate: (view: View) => void; }

const coreFeatures = [
  { emoji: "⚡", title: "Fast automation", desc: "Sub-second execution for on-chain scripts." },
  { emoji: "🤖", title: "AI-powered", desc: "Intelligent strategy generation via Multi-LLM." },
  { emoji: "🔗", title: "Wallet sync", desc: "Seamless Base & Farcaster synchronization." },
  { emoji: "🛡️", title: "Secure", desc: "Verified protocols and non-custodial ops." },
];

const modules = [
  { emoji: "🤖", title: "Automation Terminal", desc: "AI-driven monitoring & script generation", view: "chat" as View, color: "#00F0FF" },
  { emoji: "🌉", title: "Liquidity Bridge", desc: "Omnichain asset transfers via LI.FI Smart Routing", view: "bridge" as View, color: "#00F0FF", locked: true },
  { emoji: "📊", title: "Market Analytics", desc: "Real-time insights & wallet transaction metrics", view: "social" as View, color: "#00F0FF" },
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
      {/* Nav */}
      <nav className="glass sticky top-0 z-50 border-b border-warden-border px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="" className="w-8 h-8 rounded-full border border-warden-accent/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]" />
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
        {/* HERO SECTION - Visual Identity */}
        <section className="relative px-6 pt-20 md:pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none opacity-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-warden-accent/20 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto text-center flex flex-col items-center relative z-10">
            <div className="relative mb-10 inline-block group">
              <div className="absolute inset-0 bg-warden-accent/20 blur-3xl rounded-full scale-150" />
              <img 
                src="/logo.jpg" 
                alt="MRX LOLCAT" 
                className="relative w-28 h-28 md:w-40 md:h-28 rounded-3xl border border-warden-accent/30 object-cover bg-black/50 backdrop-blur-xl transition-transform group-hover:scale-105 duration-500"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-warden-accent flex items-center justify-center border-4 border-black text-black font-black animate-fade-in shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                ✓
              </div>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.85] shimmer">
              MRX LOLCAT
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 font-bold uppercase tracking-[0.4em] mb-12 max-w-[300px] md:max-w-none">
              Autonomously bridging the gap between <br className="hidden md:block" /> human intent and on-chain action.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm md:max-w-lg px-4">
              <button 
                onClick={isConnected ? () => onNavigate("chat") : () => open()} 
                className="flex-1 btn-primary py-5 text-[11px] uppercase font-black tracking-widest shadow-[0_0_40px_rgba(0,240,255,0.2)]"
              >
                Launch Intelligence
              </button>
              <a 
                href="https://github.com/mrxlolcat/mrxlolcat-agent" 
                target="_blank" 
                className="flex-1 border border-warden-border bg-white/[0.03] hover:bg-white/[0.08] text-white py-5 rounded-lg text-[11px] uppercase font-black tracking-widest transition-all flex items-center justify-center"
              >
                Access Documentation
              </a>
            </div>
          </div>
        </section>

        {/* INTRO SECTION - Breaking the Stack */}
        <section className="px-6 py-24 md:py-32 bg-[#050505] border-y border-warden-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20">
              <div className="md:w-1/3">
                <span className="text-warden-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-4 block">01 // The Vision</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none text-white">THE AGENTIC <br />REVOLUTION</h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed mb-8">
                  MRX LOLCAT is not just a chat bot. It's a high-performance automation terminal designed to monitor, bridge, and execute complex on-chain strategies while you sleep.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {coreFeatures.map(f => (
                    <div key={f.title} className="flex gap-4">
                      <div className="text-2xl pt-1">{f.emoji}</div>
                      <div>
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-1">{f.title}</h4>
                        <p className="text-[10px] text-zinc-500 leading-snug">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODULES SECTION - Functional Access */}
        <section className="px-6 py-24 md:py-32 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.3em] mb-4 block">02 // Operations</span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">PROTOCOL MODULES</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {modules.map(f => {
              const needsWallet = f.locked && !isConnected;
              return (
                <button
                  key={f.title}
                  onClick={() => handleNavigate(f.view, f.locked)}
                  className="card w-full p-8 text-left group flex flex-col items-start gap-8 hover:bg-warden-accent/[0.02] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-warden-accent/5 blur-2xl rounded-full -mr-12 -mt-12 transition-colors group-hover:bg-warden-accent/10" />
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-warden-border group-hover:border-warden-accent/30 transition-colors bg-black">
                    {f.emoji}
                  </div>
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-sm text-white uppercase tracking-tight">{f.title}</h3>
                      {f.locked && <span className="text-[8px] px-2 py-0.5 rounded-sm bg-zinc-900 text-zinc-500 border border-zinc-800 uppercase font-black tracking-widest">Auth_Req</span>}
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="w-full flex items-center justify-between mt-4">
                    <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest transition-colors group-hover:text-warden-accent/50">Initialize_Link</span>
                    <div className="text-warden-accent opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs animate-pulse">
                      _
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 pb-12 pt-12 border-t border-warden-border bg-black">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">MRX LOLCAT SYSTEM</span>
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Protocol v3.0.0-PROD // Secured via SPEx</span>
          </div>
          <div className="flex gap-8">
            <Link href="/analytics" className="text-[10px] font-bold text-zinc-500 hover:text-warden-accent transition-colors uppercase tracking-widest">Monitor</Link>
            <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-warden-accent transition-colors uppercase tracking-widest">Support</a>
            <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-warden-accent transition-colors uppercase tracking-widest">Terms</a>
          </div>
          <div className="flex items-center gap-3 bg-warden-accent/5 px-4 py-2 rounded-lg border border-warden-accent/20">
            <span className="w-2 h-2 rounded-full bg-warden-accent pulse-ring" />
            <span className="text-[10px] font-black text-warden-accent uppercase tracking-widest">Agent_Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
