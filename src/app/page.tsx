"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

export type View = "landing" | "chat" | "swap" | "launchpad" | "social" | "lending";

const Landing = dynamic(() => import("~/components/Landing"), { ssr: false });
const App = dynamic(() => import("~/components/App"), { ssr: false });
const Swap = dynamic(() => import("~/components/Swap"), { ssr: false });
const Launchpad = dynamic(() => import("~/components/Launchpad"), { ssr: false });
const Social = dynamic(() => import("~/components/Social"), { ssr: false });
const Lending = dynamic(() => import("~/components/Lending"), { ssr: false });

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const back = () => setView("landing");

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0A0910]">
      {view === "landing" && <Landing onNavigate={setView} />}
      {view === "chat" && <App onBack={back} />}
      {view === "swap" && <Swap onBack={back} />}
      {view === "launchpad" && <Launchpad onBack={back} />}
      {view === "social" && <Social onBack={back} />}
      {view === "lending" && <Lending onBack={back} />}
    </div>
  );
}
