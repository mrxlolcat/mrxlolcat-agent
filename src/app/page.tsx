"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

export type View = "landing" | "chat" | "bridge" | "swap" | "social";

const Landing = dynamic(() => import("~/components/Landing"), { ssr: false });
const App = dynamic(() => import("~/components/App"), { ssr: false });
const Bridge = dynamic(() => import("~/components/Swap"), { ssr: false });
const Social = dynamic(() => import("~/components/Social"), { ssr: false });

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const back = () => setView("landing");

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0A0910]">
      {view === "landing" && <Landing onNavigate={setView} />}
      {view === "chat" && <App onBack={back} />}
      {view === "bridge" && <Bridge onBack={back} initialMode="bridge" />}
      {view === "swap" && <Bridge onBack={back} initialMode="swap" />}
      {view === "social" && <Social onBack={back} />}
    </div>
  );
}
