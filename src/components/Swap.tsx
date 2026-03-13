"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { LifiWidgetEmbed } from "../integrations/lifi/widget";

interface SwapProps { onBack: () => void; }

export default function Swap({ onBack }: SwapProps) {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();

  // Jika dompet belum terhubung, tampilkan opsi connect wallet
  if (!isConnected) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col" style={{ background: "#09090B" }}>
        <nav className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
          <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
          <h1 className="font-semibold text-sm flex-1">🌉 Bridge Assets</h1>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6" style={{ background: "rgba(99, 102, 241, 0.1)" }}>🤠</div>
          <h2 className="font-bold text-xl mb-2">Connect Your Wallet</h2>
          <p className="text-sm text-zinc-400 mb-6 max-w-[260px]">Connect your wallet to bridge tokens across 60+ chains using LI.FI.</p>
          <button onClick={() => open()} className="btn-primary px-8 py-3 text-sm">Connect Wallet</button>
        </div>
      </div>
    );
  }

  // Jika terhubung, tampilkan UI LI.FI Widget yang sangat canggih
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col" style={{ background: "#09090B" }}>
      {/* Header */}
      <nav className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
        <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
        <div className="flex-1">
          <h1 className="font-semibold text-sm">🌉 Bridge Assets</h1>
          <p className="text-[10px] text-zinc-500">Powered by LI.FI Smart Routing</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium"
          style={{ background: "rgba(34,197,94,0.08)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.15)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          {address?.slice(0, 4)}…{address?.slice(-3)}
        </button>
      </nav>

      {/* Widget Container */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <LifiWidgetEmbed />
      </div>
    </div>
  );
}
