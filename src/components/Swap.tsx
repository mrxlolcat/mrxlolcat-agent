"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { LifiWidgetEmbed } from "./Bridge/LifiWidget";

export default function Swap() {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();

  if (!isConnected) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-black px-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-warden-accent/20 blur-3xl rounded-full" />
          <img src="/logo.jpg" className="relative w-24 h-24 rounded-full border border-warden-accent/30 object-cover backdrop-blur-xl" />
        </div>
        <h2 className="font-black text-xl mb-3 tracking-tighter uppercase text-white">Initialize Key</h2>
        <p className="text-[11px] text-zinc-500 mb-8 max-w-[240px] font-medium leading-relaxed uppercase tracking-wider">Authentication required to access omnichain liquidity modules.</p>
        <button onClick={() => open()} className="btn-primary px-10 py-4 text-[11px] w-full max-w-[240px]">Connect Access Key</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black">
      <header className="glass border-b border-warden-border flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex flex-col">
          <h1 className="font-bold text-[11px] uppercase tracking-widest text-white">Omnichain<span className="text-warden-accent">Bridge</span></h1>
          <p className="text-[8px] font-mono text-zinc-500 uppercase">Router Active</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-2 text-[10px] px-2 py-1 rounded-md font-bold border border-warden-border bg-warden-accent/5 text-warden-accent">
          <span className="w-1 h-1 rounded-full bg-warden-accent" />
          {address?.slice(0, 4)}…{address?.slice(-3)}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-xl animate-fade-in"><LifiWidgetEmbed /></div>
        <p className="text-[9px] text-zinc-700 font-mono mt-12 uppercase tracking-[0.4em] text-center">Securely routed via LI.FI Protocol v3</p>
      </div>
    </div>
  );
}
