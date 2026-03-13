"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import Chat from "./Chat";
import Swap from "./Swap";

export default function App() {
  const [ready, setReady] = useState(false);
  const [context, setContext] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"terminal" | "bridge">("terminal");

  const init = useCallback(async () => {
    try {
      const ctx = await sdk.context;
      setContext(ctx);
      await sdk.actions.ready();
    } catch { }
    setReady(true);
  }, []);

  useEffect(() => { init(); }, [init]);

  if (!ready) return null;

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-black">
      <div className="flex-1 overflow-hidden">
        {activeTab === "terminal" ? <Chat context={context} /> : <Swap />}
      </div>

      <nav className="glass border-t border-warden-border flex items-center justify-center gap-16 py-4 shrink-0">
        <button onClick={() => setActiveTab("terminal")} className={`group flex flex-col items-center gap-1 ${activeTab === "terminal" ? "text-warden-accent" : "text-zinc-600"}`}>
          <div className={`w-8 h-1 rounded-full mb-1 transition-all ${activeTab === "terminal" ? "bg-warden-accent shadow-[0_0_15px_rgba(0,240,255,0.6)]" : "bg-transparent"}`} />
          <span className="text-xl">🤖</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Terminal</span>
        </button>
        <button onClick={() => setActiveTab("bridge")} className={`group flex flex-col items-center gap-1 ${activeTab === "bridge" ? "text-warden-accent" : "text-zinc-600"}`}>
          <div className={`w-8 h-1 rounded-full mb-1 transition-all ${activeTab === "bridge" ? "bg-warden-accent shadow-[0_0_15px_rgba(0,240,255,0.6)]" : "bg-transparent"}`} />
          <span className="text-xl">🌉</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Bridge</span>
        </button>
      </nav>
    </div>
  );
}
