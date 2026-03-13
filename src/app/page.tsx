"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

export type View = "landing" | "app" | "social" | "analytics" | "chat" | "bridge" | "swap";

const Landing = dynamic(() => import("~/components/Landing"), { ssr: false });
const App = dynamic(() => import("~/components/App"), { ssr: false });
const Social = dynamic(() => import("~/components/Social"), { ssr: false });

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [initialTab, setInitialTab] = useState<"terminal" | "liquidity">("terminal");

  const navigateToApp = (tab: "terminal" | "liquidity" = "terminal") => {
    setInitialTab(tab);
    setView("app");
  };

  const back = () => setView("landing");

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0A0910]">
      {view === "landing" && <Landing onNavigate={(v: any) => {
        if (v === "chat") navigateToApp("terminal");
        else if (v === "swap" || v === "bridge") navigateToApp("liquidity");
        else setView(v);
      }} />}
      {view === "app" && <App onBack={back} startTab={initialTab} />}
      {view === "social" && <Social onBack={back} />}
    </div>
  );
}
