"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { LifiWidgetEmbed } from "./Bridge/LifiWidget";

interface SwapProps { 
  onBack: () => void; 
  initialMode?: 'swap' | 'bridge';
}

export default function Swap({ onBack, initialMode = 'bridge' }: SwapProps) {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();

  const isSwap = initialMode === 'swap';
  const title = isSwap ? "Swap Tokens" : "Bridge Assets";
  const iconText = isSwap ? "🔄" : "🌉";

  // Jika dompet belum terhubung, tampilkan opsi connect wallet
  if (!isConnected) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col bg-black">
        <nav className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-warden-border">
          <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
          <h1 className="font-bold text-[11px] uppercase tracking-widest flex-1">{isSwap ? "Protocol" : "Omnichain"}<span className="text-warden-accent">{isSwap ? "Swap" : "Bridge"}</span></h1>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-warden-accent/20 blur-3xl rounded-full" />
            <img 
              src="/logo.jpg" 
              alt="MRX LOLCAT" 
              className="relative w-24 h-24 rounded-full border border-warden-accent/30 object-cover bg-black/50 backdrop-blur-xl"
            />
          </div>
          <h2 className="font-black text-xl mb-3 tracking-tighter uppercase">Initialize Key</h2>
          <p className="text-[11px] text-zinc-500 mb-8 max-w-[240px] font-medium leading-relaxed uppercase tracking-wider">Authentication required to access {isSwap ? "liquidity pools" : "omnichain liquidity modules"}.</p>
          <button onClick={() => open()} className="btn-primary px-10 py-4 text-[11px] w-full max-w-[240px]">Connect Access Key</button>
        </div>
      </div>
    );
  }

  // Jika terhubung, tampilkan UI LI.FI Widget yang sangat canggih
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-black">
      {/* Header */}
      <nav className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-warden-border">
        <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
        <div className="flex-1">
          <h1 className="font-bold text-[11px] uppercase tracking-widest">{isSwap ? "Protocol" : "Omnichain"}<span className="text-warden-accent">{isSwap ? "Swap" : "Bridge"}</span></h1>
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">{isSwap ? "SMART ROUTING POOL ACTIVE" : "OMNICHAIN LIQUIDITY ROUTER ACTIVE"}</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-2 text-[10px] px-2 py-1.5 rounded-md font-bold transition-all border border-warden-border"
          style={{ background: "rgba(0, 240, 255, 0.05)", color: "#00F0FF" }}>
          <span className="w-1 h-1 rounded-full bg-warden-accent" />
          {address?.slice(0, 4)}…{address?.slice(-3)}
        </button>
      </nav>

      {/* Widget Container */}
      <div className="flex-1 overflow-y-auto px-2 py-6 flex flex-col items-center">
        <div className="w-full max-w-md animate-fade-in">
           <LifiWidgetEmbed />
        </div>
        <p className="text-[9px] text-zinc-700 font-mono mt-8 uppercase tracking-[0.3em]">Securely routed via LI.FI Protocol</p>
      </div>
    </div>
  );
}
