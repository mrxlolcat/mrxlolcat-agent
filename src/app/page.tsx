"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

export type View = "app" | "social" | "analytics";

const App = dynamic(() => import("~/components/App"), { ssr: false });
const Social = dynamic(() => import("~/components/Social"), { ssr: false });

export default function Home() {
  const [view, setView] = useState<View>("app");

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0A0910]">
      {view === "app" && <App />}
      {view === "social" && <Social onBack={() => setView("app")} />}
    </div>
  );
}
