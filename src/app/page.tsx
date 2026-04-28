"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/panels/ChatPanel";
import SwapPanel from "@/components/panels/SwapPanel";
import LendingPanel from "@/components/panels/LendingPanel";

type Panel = "chat" | "swap" | "lending" | "social" | "launchpad";

export default function Home() {
  const [activePanel, setActivePanel] = useState<Panel>("chat");

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar activePanel={activePanel} onSelectPanel={setActivePanel} />

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <div className="hidden lg:block">
          <Sidebar activePanel={activePanel} onSelectPanel={setActivePanel} />
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5 lg:hidden">
            {(["chat", "swap", "lending", "social", "launchpad"] as Panel[]).map((panel) => (
              <button
                key={panel}
                type="button"
                data-active={activePanel === panel}
                onClick={() => setActivePanel(panel)}
                className="nav-pill justify-center"
              >
                {panel}
              </button>
            ))}
          </div>

          <div>
            {activePanel === "chat" ? <ChatPanel /> : null}
            {activePanel === "swap" ? <SwapPanel /> : null}
            {activePanel === "lending" ? <LendingPanel /> : null}
            {activePanel === "social" ? (
              <section className="panel-card min-h-[680px]">
                <div className="panel-title">Social Feed</div>
                <h2 className="mt-2 text-2xl font-semibold">Placeholder panel</h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Panel sosial bisa diisi berikutnya.</p>
              </section>
            ) : null}
            {activePanel === "launchpad" ? (
              <section className="panel-card min-h-[680px]">
                <div className="panel-title">Launchpad</div>
                <h2 className="mt-2 text-2xl font-semibold">Placeholder panel</h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Panel launchpad bisa diisi berikutnya.</p>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
