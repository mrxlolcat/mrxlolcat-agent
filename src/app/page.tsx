"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/panels/ChatPanel";
import SwapPanel from "@/components/panels/SwapPanel";
import LendingPanel from "@/components/panels/LendingPanel";

type Panel = "chat" | "swap" | "lending" | "bridge";

export default function Home() {
  const [activePanel, setActivePanel] = useState<Panel>("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <Sidebar
        activePanel={activePanel}
        onSelectPanel={setActivePanel}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-[var(--text)]">mrxlolcat</span>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-hidden">
          {activePanel === "chat" && <ChatPanel />}
          {activePanel === "swap" && (
            <div className="h-full overflow-y-auto p-4 lg:p-6">
              <div className="mx-auto max-w-4xl">
                <SwapPanel />
              </div>
            </div>
          )}
          {activePanel === "lending" && (
            <div className="h-full overflow-y-auto p-4 lg:p-6">
              <div className="mx-auto max-w-4xl">
                <LendingPanel />
              </div>
            </div>
          )}
          {activePanel === "bridge" && (
            <div className="h-full overflow-y-auto p-4 lg:p-6">
              <div className="mx-auto max-w-4xl">
                <section className="panel-card min-h-[400px]">
                  <div className="panel-title">Bridge</div>
                  <h2 className="mt-2 text-2xl font-semibold">Cross-Chain Bridge</h2>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Bridge tokens across chains using LI.FI Smart Routing.
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
