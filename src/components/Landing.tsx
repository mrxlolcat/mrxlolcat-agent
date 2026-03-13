"use client";

import type { View } from "~/app/page";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";

interface LandingProps { onNavigate: (view: View) => void; }

const features = [
  { emoji: "🤖", title: "AI Agent", desc: "Multi-model streaming chat with long-term memory", view: "chat" as View, color: "#818CF8" },
  { emoji: "🌉", title: "Bridge", desc: "Swap & bridge tokens across 60+ chains instantly", view: "bridge" as View, color: "#34D399", locked: true },
  { emoji: "💬", title: "Social", desc: "Real-time AI agent social feed & discovery", view: "social" as View, color: "#60A5FA" },
];

export default function Landing({ onNavigate }: LandingProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const handleNavigate = (view: View, locked?: boolean) => {
    if (locked && !isConnected) { open(); return; }
    onNavigate(view);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col" style={{ background: "#09090B" }}>
      {/* Nav */}
      <nav className="glass sticky top-0 z-50 border-b border-zinc-800/60 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐱</span>
            <span className="font-bold text-sm gradient-text">mrxlolcat</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/analytics" className="text-[11px] text-zinc-400 hover:text-white transition">
              📊 Analytics
            </Link>
            <button
              onClick={() => open()}
              className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all"
              style={isConnected ? {
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                color: "#4ADE80",
              } : {
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                color: "white",
              }}
            >
              {isConnected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-ring" />
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </>
              ) : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-5 pt-10 pb-8 text-center">
        <div className="relative inline-block mb-5">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg, #312E81, #4C1D95)" }}>🤠</div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center text-[10px] border-2 border-[#09090B]">✓</div>
        </div>
        <h1 className="text-2xl font-extrabold mb-2 shimmer">mrxlolcat-agent</h1>
        <p className="text-[13px] text-zinc-400 leading-relaxed max-w-[300px] mx-auto">
          The ultimate LI.FI powered super agent on Farcaster.
          <br />Bridge across 60+ chains with ease.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-6 mb-2">
          {[
            { v: "60+", l: "Chains" },
            { v: "LI.FI", l: "Smart Engine" },
            { v: "0.1%", l: "Fee" },
          ].map(s => (
            <div key={s.l}>
              <p className="text-lg font-extrabold gradient-text">{s.v}</p>
              <p className="text-[10px] text-zinc-500 font-medium">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wallet CTA (if not connected) */}
      {!isConnected && (
        <section className="px-5 pb-5">
          <button onClick={() => open()} className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 110-6h.75A2.25 2.25 0 0118 6v0a2.25 2.25 0 012.25 2.25M21 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v6z" />
            </svg>
            Connect Wallet to Start Bridging
          </button>
        </section>
      )}

      {/* Features grid */}
      <section className="px-4 pb-5 flex-1 max-w-sm mx-auto w-full">
        <div className="grid grid-cols-1 gap-2.5">
          {features.map(f => {
            const needsWallet = f.locked && !isConnected;
            return (
              <button
                key={f.title}
                onClick={() => handleNavigate(f.view, f.locked)}
                className="card p-4 text-left group relative overflow-hidden flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}15` }}>
                  {f.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[14px] text-white mb-0.5">{f.title}</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
                {needsWallet ? (
                  <div className="text-zinc-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Connected state: Quick actions */}
      {isConnected && (
        <section className="px-5 pb-4">
          <button
            onClick={() => onNavigate("bridge")}
            className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2"
          >
            🔄 Open LI.FI Bridge
          </button>
        </section>
      )}

      {/* Footer */}
      <footer className="px-5 pb-5 pt-2">
        <div className="flex items-center justify-between text-[10px] text-zinc-600">
          <span>mrxlolcat-agent · Farcaster Mini App</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
