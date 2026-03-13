"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import Chat from "./Chat";
import Swap from "./Swap";

interface AppProps {
  onBack?: () => void;
  startTab?: "terminal" | "liquidity";
}

export default function App({ onBack, startTab = "terminal" }: AppProps) {
  const [ready, setReady] = useState(false);
  const [context, setContext] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"terminal" | "liquidity">(startTab);

  const init = useCallback(async () => {
    try {
      const ctx = await sdk.context;
      setContext(ctx);
      await sdk.actions.ready();
    } catch {
      console.log("[mrxlolcat-agent] standalone mode");
    }
    setReady(true);
  }, []);

  useEffect(() => { init(); }, [init]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🤠</div>
          <p className="gradient-text font-black text-lg uppercase tracking-widest">Initializing MRX LOLCAT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-black">
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "terminal" ? (
          <Chat context={context} onBack={onBack || (() => {})} />
        ) : (
          <Swap onBack={onBack || (() => {})} />
        )}
      </div>

      {/* Tab Navigation (Inside App) */}
      <nav className="glass border-t border-warden-border flex items-center justify-center gap-12 py-4 shrink-0">
        <button 
          onClick={() => setActiveTab("terminal")}
          className={`group flex flex-col items-center gap-1 transition-all ${activeTab === "terminal" ? "text-warden-accent" : "text-zinc-600 hover:text-zinc-400"}`}
        >
          <div className={`w-8 h-1 rounded-full mb-1 transition-all ${activeTab === "terminal" ? "bg-warden-accent shadow-[0_0_15px_rgba(0,240,255,0.6)]" : "bg-transparent"}`} />
          <span className="text-xl group-hover:scale-110 transition-transform">🤖</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Terminal</span>
        </button>
        
        <button 
          onClick={() => setActiveTab("liquidity")}
          className={`group flex flex-col items-center gap-1 transition-all ${activeTab === "liquidity" ? "text-warden-accent" : "text-zinc-600 hover:text-zinc-400"}`}
        >
          <div className={`w-8 h-1 rounded-full mb-1 transition-all ${activeTab === "liquidity" ? "bg-warden-accent shadow-[0_0_15px_rgba(0,240,255,0.6)]" : "bg-transparent"}`} />
          <span className="text-xl group-hover:scale-110 transition-transform">🌉</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Liquidity</span>
        </button>
      </nav>
    </div>
  );
}
