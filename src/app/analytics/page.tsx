"use client";

import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [metrics] = useState({
    totalChats: 12450,
    activeFIDs: 342,
    usdcTipped: 145.5,
    frameClicks: 890,
  });

  return (
    <div className="min-h-screen bg-[#0A0910] text-white p-6">
      <header className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-zinc-400 hover:text-white transition">← Back</Link>
          <h1 className="text-xl font-bold gradient-text">Cat Agent Analytics</h1>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <div className="text-zinc-400 text-sm mb-1">Total Chats</div>
          <div className="text-3xl font-bold text-indigo-400">{metrics.totalChats.toLocaleString()}</div>
        </div>
        <div className="card p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <div className="text-zinc-400 text-sm mb-1">Active FIDs</div>
          <div className="text-3xl font-bold text-blue-400">{metrics.activeFIDs.toLocaleString()}</div>
        </div>
        <div className="card p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <div className="text-zinc-400 text-sm mb-1">USDC Tipped</div>
          <div className="text-3xl font-bold text-green-400">${metrics.usdcTipped}</div>
        </div>
        <div className="card p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <div className="text-zinc-400 text-sm mb-1">Frame Interactions</div>
          <div className="text-3xl font-bold text-pink-400">{metrics.frameClicks.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
