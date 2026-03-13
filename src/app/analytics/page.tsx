"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RevenueDashboard from "../../components/Analytics/Revenue";

const MOCK_LOGS = [
  "INITIALIZING AGENT CORE...",
  "SYNCING FARCASTER FID DATA...",
  "CONNECTING TO PINECONE VECTOR NODE...",
  "SCANNING BASE MAINNET MEMPOOL...",
  "LI.FI SMART ROUTER WARMING UP...",
  "MONITORING WALLET ADDRESSES [42 ACTIVE]...",
  "FETCHING OPENROUTER LLM FALLBACKS...",
  "SECURITY PROTOCOLS [SPEx] VERIFIED.",
  "AGENT READY FOR COMMANDS.",
];

export default function AnalyticsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics] = useState({
    totalChats: 12450,
    baseTxVolume: 3420,
    usdcTipped: 145.5,
    totalCasts: 890,
    uptime: "99.98%",
  });

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < MOCK_LOGS.length) {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${MOCK_LOGS[i]}`]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto w-full">
        <header className="flex items-center justify-between mb-8 border-b border-warden-border pb-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-zinc-500 hover:text-warden-accent transition-colors text-sm font-bold uppercase tracking-widest">
              ← Terminal
            </Link>
            <img src="/logo.jpg" alt="" className="w-6 h-6 rounded-full border border-warden-accent/30" />
            <h1 className="text-lg font-black tracking-tighter uppercase">Agent<span className="text-warden-accent">Monitor</span></h1>
          </div>
          <div className="flex items-center gap-2 bg-warden-accent/5 px-3 py-1.5 rounded-md border border-warden-accent/20">
            <span className="w-2 h-2 rounded-full bg-warden-accent pulse-ring" />
            <span className="text-[10px] font-bold text-warden-accent uppercase tracking-widest">System Active</span>
          </div>
        </header>

        {/* Revenue Section */}
        <RevenueDashboard />

        {/* Grid Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="card p-4 bg-zinc-900/30">
            <div className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mb-1">Ops Processed</div>
            <div className="text-2xl font-black text-white">{metrics.totalChats.toLocaleString()}</div>
          </div>
          <div className="card p-4 bg-zinc-900/30">
            <div className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mb-1">Base TX Count</div>
            <div className="text-2xl font-black text-white">{metrics.baseTxVolume.toLocaleString()}</div>
          </div>
          <div className="card p-4 bg-zinc-900/30">
            <div className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mb-1">Net Revenue</div>
            <div className="text-2xl font-black text-warden-accent">${metrics.usdcTipped}</div>
          </div>
          <div className="card p-4 bg-zinc-900/30">
            <div className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mb-1">System Uptime</div>
            <div className="text-2xl font-black text-emerald-500">{metrics.uptime}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Logs / Terminal */}
          <div className="card bg-black border-warden-border overflow-hidden flex flex-col h-[400px] lg:col-span-2">
            <div className="bg-zinc-900/50 px-4 py-2 border-b border-warden-border flex items-center justify-between">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Live System Logs</span>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1.5 selection:bg-warden-accent/30">
              {logs.map((log, idx) => (
                <div key={idx} className="animate-fade-in flex gap-3">
                  <span className="text-warden-accent/50 shrink-0">#</span>
                  <span className={idx === logs.length - 1 ? "text-warden-accent" : "text-zinc-400"}>{log}</span>
                </div>
              ))}
              <div className="animate-pulse inline-block w-2 h-4 bg-warden-accent ml-7" />
            </div>
          </div>

          {/* Recent Actions */}
          <div className="flex flex-col">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Recent Verified Actions</p>
            <div className="space-y-2">
              {[
                { a: "SWAP", d: "10 USDC -> ETH", c: "BASE", t: "2m ago" },
                { a: "BRIDGE", d: "50 USDC Base -> OP", c: "BASE/OP", t: "15m ago" },
                { a: "ALERT", d: "Price Trigger: ETH > $3k", c: "SYSTEM", t: "1h ago" },
                { a: "MONITOR", d: "Wallet Sync Successful", c: "BASE", t: "3h ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-warden-border bg-zinc-900/10 hover:bg-zinc-900/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase">{item.a}</span>
                    <span className="text-[11px] font-bold text-zinc-300">{item.d}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono text-zinc-500 uppercase">{item.c}</p>
                    <p className="text-[8px] text-zinc-700">{item.t}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
